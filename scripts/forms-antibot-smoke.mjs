import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { createServer as createVite, build, preview } from "vite";
import { createServer } from "../backend/contact-api/server.js";
import { createShopService } from "../backend/contact-api/shop/service.js";
import {
  createBotCheck,
  createFormSecurity,
} from "../backend/contact-api/forms/security.js";
import { ContactReceipts } from "../backend/contact-api/forms/receipts.js";
import { startSmtpSink } from "../backend/contact-api/test/smtp-sink.js";

const require = createRequire(
  new URL("../backend/contact-api/package.json", import.meta.url),
);
const nodemailer = require("nodemailer");
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const output = process.env.QA_OUTPUT || "/tmp/aihub-forms-antibot-qa";
const temporary = await fs.mkdtemp(
  path.join(os.tmpdir(), "aihub-forms-browser-"),
);
const realWidget = process.env.QA_REAL_TURNSTILE === "true";
const report = {
  checks: [],
  errors: [],
  failedAssets: [],
  externalWrites: [],
  submissions: [],
  widget: realWidget
    ? "official test widget; stubbed Siteverify"
    : "deterministic widget and Siteverify stubs with official test keys",
};
await fs.mkdir(output, { recursive: true });
const check = (name, condition = true) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const smtp = await startSmtpSink();
const transport = nodemailer.createTransport(smtp.transportOptions);
const origins = [];
const receipts = new ContactReceipts(path.join(temporary, "receipts.sqlite"));
let nextFailure = "";
let sheetFailure = false;
let mailUnknown = false;
let mailCalls = 0;
let sheetCalls = 0;
const verification = [];
const security = createFormSecurity();
security.bot = {
  required: true,
  async verify(token, action) {
    return createBotCheck({
      required: true,
      production: false,
      secretKey: "1x0000000000000000000000000000000AA",
      hostnames: ["localhost"],
      fetchImpl: async () => {
        verification.push(action);
        const failure = nextFailure;
        nextFailure = "";
        if (failure === "unavailable")
          throw new Error("test-only provider failure");
        return {
          ok: true,
          json: async () => ({
            success: failure !== "reject",
            hostname: "localhost",
            action:
              token === "XXXX.DUMMY.TOKEN.XXXX" ? action : token.split(":")[0],
          }),
        };
      },
    }).verify(token, action);
  },
};
const shop = createShopService({
  filename: path.join(temporary, "shop.sqlite"),
  origins,
  sendMail: (mail) => transport.sendMail(mail),
  from: "test@example.test",
  formSecurity: security,
  limit: 1000,
  log: () => {},
});
const api = createServer({
  shopService: shop,
  formSecurity: security,
  contactReceipts: receipts,
  contactLimit: 1000,
  contactLog: () => {},
  contactEmail: async (lead) => {
    mailCalls++;
    const result = await transport.sendMail({
      from: "test@example.test",
      to: "local-sink@example.test",
      subject: "Local contact test",
      text: `${lead.name}: ${lead.email}`,
    });
    if (mailUnknown)
      throw Object.assign(new Error("test-only lost SMTP acknowledgement"), {
        code: "ETIMEDOUT",
      });
    return result;
  },
  contactSheet: async () => {
    sheetCalls++;
    if (sheetFailure)
      throw Object.assign(new Error("test-only rejected sheet write"), {
        code: 403,
      });
  },
});
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
const apiUrl = `http://127.0.0.1:${api.address().port}`;
process.env.VITE_CONTACT_API_URL = apiUrl;
process.env.VITE_SHOP_API_URL = apiUrl;
process.env.VITE_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
const prefix = process.env.QA_BASE || "/";
let vite;
let closeVite;
if (process.env.QA_PRODUCTION === "true") {
  const outDir = path.join(temporary, "dist");
  await build({
    mode: "test",
    base: prefix,
    logLevel: "warn",
    build: { outDir, emptyOutDir: true },
  });
  vite = await preview({
    mode: "test",
    base: prefix,
    logLevel: "warn",
    build: { outDir },
    preview: { host: "127.0.0.1", port: 0 },
  });
  closeVite = () => new Promise((resolve) => vite.httpServer.close(resolve));
} else {
  vite = await createVite({
    mode: "test",
    base: prefix,
    logLevel: "warn",
    server: { host: "127.0.0.1", port: 0, watch: null },
  });
  await vite.listen();
  closeVite = () => vite.close();
}
const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
origins.push(origin);
const base = `${origin}${prefix}`;
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const contexts = [];

function installWidgetStub(mode) {
  let sequence = 0;
  const widgets = new Map();
  window.__formTestMode = mode;
  const complete = (id) => {
    const entry = widgets.get(id);
    if (!entry) return;
    if (window.__formTestMode === "error") {
      entry.options["error-callback"]("test-error");
      return;
    }
    entry.options.callback(`${entry.options.action}:${crypto.randomUUID()}`);
  };
  window.__expireFormTest = () => {
    for (const { options } of widgets.values()) options["expired-callback"]();
  };
  window.turnstile = {
    render(container, options) {
      const id = String(++sequence);
      widgets.set(id, { container, options });
      container.dataset.testSitekey = options.sitekey;
      container.dataset.testLanguage = options.language;
      if (window.__formTestMode === "interactive") {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Verify test visitor";
        button.onclick = () => complete(id);
        container.appendChild(button);
      } else setTimeout(() => complete(id), 10);
      return id;
    },
    reset(id) {
      setTimeout(() => complete(id), 10);
    },
    remove(id) {
      widgets.get(id)?.container.replaceChildren();
      widgets.delete(id);
    },
  };
}

async function fresh({
  lang = "en",
  width = 390,
  motion = "reduce",
  mode = "pass",
  checkout = false,
} = {}) {
  const context = await browser.newContext({
    viewport: { width, height: 1000 },
    reducedMotion: motion,
  });
  contexts.push(context);
  if (!realWidget && mode !== "blocked")
    await context.addInitScript(installWidgetStub, mode);
  await context.route("**/*", (route) => {
    const request = route.request();
    const target = new URL(request.url());
    if ([origin, apiUrl].includes(target.origin)) return route.continue();
    if (realWidget && target.hostname === "challenges.cloudflare.com")
      return route.continue();
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method()))
      report.externalWrites.push(target.origin);
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(realWidget ? 30000 : 15000);
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(origin) && response.status() >= 400)
      report.failedAssets.push(response.url());
  });
  page.on("request", (request) => {
    if (request.method() !== "POST" || !request.url().startsWith(apiUrl))
      return;
    const headers = request.headers();
    report.submissions.push({
      path: new URL(request.url()).pathname,
      keyHash: createHash("sha256")
        .update(headers["idempotency-key"] || "")
        .digest("hex"),
      proofPresent: !!headers["x-turnstile-token"],
      bodyHasToken: /turnstile|DUMMY.TOKEN|contact_submit:|shop_submit:/.test(
        request.postData() || "",
      ),
    });
  });
  if (checkout) {
    await page.goto(`${base}shop.html?lang=${lang}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.evaluate(() =>
      localStorage.setItem(
        "aihub_cart",
        JSON.stringify([{ id: 1, packageId: "start", qty: 1 }]),
      ),
    );
    await page.goto(`${base}checkout.html?lang=${lang}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.waitForFunction(
      () => !document.querySelector('button[type="submit"]')?.disabled,
    );
  } else {
    await page.goto(`${base}?lang=${lang}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    await page.locator('form[tool-name="book-consultation"]').waitFor();
  }
  return {
    context,
    page,
    form: page.locator(
      checkout ? ".checkout-form" : 'form[tool-name="book-consultation"]',
    ),
  };
}

let customerSequence = 0;
async function fill(form, checkout = false) {
  await form.locator('[name="name"]').fill(`Local Test ${++customerSequence}`);
  await form.locator('[name="email"]').fill("local@example.test");
  if (checkout) {
    await form.locator('[name="country"]').selectOption("PL");
    await form.locator('[name="address"]').fill("Test Street 1");
    await form.locator('[name="city"]').fill("Poznan");
    await form.locator('[name="postalCode"]').fill("61-806");
    await form.locator('[name="termsAccepted"]').check();
  }
}
const send = (form) => form.locator('button[type="submit"]').click();
const waitContactSuccess = (form) =>
  form
    .getByRole("status")
    .filter({ hasText: /Thank you|Спасибо/ })
    .waitFor();
const waitShopSuccess = (page) => page.locator(".checkout-success").waitFor();

try {
  for (const lang of ["en", "ru"]) {
    for (const checkout of [false, true]) {
      const { context, page, form } = await fresh({ lang, checkout });
      check(
        `${lang}/${checkout ? "checkout" : "contact"}: no check before form interaction`,
        (await page.locator(".form-security").count()) === 0,
      );
      await fill(form, checkout);
      for (const width of realWidget
        ? [390]
        : [390, 768, 1199, 1200, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 });
        check(
          `${lang}/${checkout ? "checkout" : "contact"}/${width}: no overflow`,
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
      }
      await page.setViewportSize({ width: 390, height: 1000 });
      await page.evaluate(() => {
        document.querySelector("main").scrollLeft = 0;
      });
      const hp = form.locator('[name="website"]');
      check(
        `${lang}/${checkout ? "checkout" : "contact"}: honeypot excluded from keyboard`,
        (await hp.getAttribute("tabindex")) === "-1" &&
          (await hp.evaluate(
            (input) => !!input.closest('[aria-hidden="true"]'),
          )),
      );
      if (!realWidget)
        check(
          `${lang}/${checkout ? "checkout" : "contact"}: official test sitekey and language`,
          (await page
            .locator("[data-test-sitekey]")
            .getAttribute("data-test-sitekey")) ===
            process.env.VITE_TURNSTILE_SITE_KEY &&
            (await page
              .locator("[data-test-language]")
              .getAttribute("data-test-language")) === lang,
        );
      await send(form);
      if (checkout) await waitShopSuccess(page);
      else await waitContactSuccess(form);
      check(
        `${lang}/${checkout ? "checkout" : "contact"}: successful protected submission`,
      );
      if (checkout)
        check(
          `${lang}: accepted cart consumed once`,
          (await page.evaluate(() => localStorage.getItem("aihub_cart"))) ===
            "[]",
        );
      await page.screenshot({
        path: `${output}/${checkout ? "checkout" : "contact"}-${lang}-success.png`,
        fullPage: checkout,
      });
      await context.close();
    }
  }

  if (!realWidget) {
    for (const checkout of [false, true]) {
      const { context, page, form } = await fresh({
        checkout,
        lang: "ru",
        width: 1440,
        motion: "no-preference",
      });
      await fill(form, checkout);
      const originalName = await form.locator('[name="name"]').inputValue();
      const before = report.submissions.length;
      const sentMail = mailCalls;
      const stored = shop.store.stats().requests;
      nextFailure = "reject";
      await send(form);
      await page
        .getByText(/Не удалось выполнить проверку безопасности/)
        .first()
        .waitFor();
      check(
        `${checkout ? "checkout" : "contact"}: rejected proof preserves fields and has no effects`,
        (await form.locator('[name="name"]').inputValue()) === originalName &&
          mailCalls === sentMail &&
          shop.store.stats().requests === stored,
      );
      check(`${checkout ? "checkout" : "contact"}: fields stay within viewport after rejection`, await form.locator('[name="email"]').evaluate((input) => {
        const box = input.getBoundingClientRect();
        return box.left >= 0 && box.right <= innerWidth;
      }));
      await page.screenshot({
        path: `${output}/${checkout ? "checkout" : "contact"}-rejected.png`,
      });
      nextFailure = "unavailable";
      await send(form);
      await page
        .getByText(/Не удалось выполнить проверку безопасности/)
        .first()
        .waitFor();
      await form.locator('button[type="submit"]').waitFor({ state: "visible" });
      await page.waitForFunction(
        () => !document.querySelector('form button[type="submit"]')?.disabled,
      );
      check(
        `${checkout ? "checkout" : "contact"}: provider failure keeps fields`,
        (await form.locator('[name="name"]').inputValue()) === originalName,
      );
      await page.evaluate(() => window.__expireFormTest());
      await page
        .getByRole("button", { name: "Повторить проверку", exact: true })
        .click();
      await send(form);
      if (checkout) await waitShopSuccess(page);
      else await waitContactSuccess(form);
      check(
        `${checkout ? "checkout" : "contact"}: expiry reset and retry succeed`,
        report.submissions.length === before + 3,
      );
      await context.close();
    }

    const lostContact = await fresh();
    await fill(lostContact.form);
    const contactBefore = mailCalls;
    const submissionStart = report.submissions.length;
    const dropContact = async (route) => {
      await route.fetch();
      await route.abort();
    };
    await lostContact.page.route(`${apiUrl}/api/contact`, dropContact);
    await send(lostContact.form);
    await lostContact.form.getByText(/could not confirm delivery/i).waitFor();
    await lostContact.page.unroute(`${apiUrl}/api/contact`, dropContact);
    await send(lostContact.form);
    await waitContactSuccess(lostContact.form);
    check(
      "Contact lost response reuses the same key without duplicate email",
      mailCalls === contactBefore + 1 &&
        report.submissions[submissionStart].keyHash ===
          report.submissions[submissionStart + 1].keyHash,
    );
    await lostContact.context.close();

    const lostShop = await fresh({ checkout: true });
    await fill(lostShop.form, true);
    const requestsBefore = shop.store.stats().requests;
    const dropShop = async (route) => {
      await route.fetch();
      await route.abort();
    };
    await lostShop.page.route(`${apiUrl}/api/shop/requests`, dropShop);
    await send(lostShop.form);
    await lostShop.page
      .getByRole("button", { name: "Check request status", exact: true })
      .waitFor();
    await lostShop.page.unroute(`${apiUrl}/api/shop/requests`, dropShop);
    await lostShop.page.evaluate(() => {
      window.__formTestMode = "error";
    });
    await lostShop.page
      .getByRole("button", { name: "Check request status", exact: true })
      .click();
    await waitShopSuccess(lostShop.page);
    check(
      "Shop status recovery works while the widget is unavailable",
      shop.store.stats().requests === requestsBefore + 1,
    );
    await lostShop.context.close();

    const partial = await fresh();
    await fill(partial.form);
    const mailBeforePartial = mailCalls;
    const sheetBeforePartial = sheetCalls;
    sheetFailure = true;
    await send(partial.form);
    await partial.form.getByText(/could not confirm delivery/i).waitFor();
    sheetFailure = false;
    await send(partial.form);
    await waitContactSuccess(partial.form);
    check(
      "Contact retry only repeats the definitively rejected sheet operation",
      mailCalls === mailBeforePartial + 1 &&
        sheetCalls === sheetBeforePartial + 2,
    );
    await partial.context.close();

    const unknown = await fresh();
    await fill(unknown.form);
    const beforeUnknown = report.submissions.length;
    mailUnknown = true;
    await send(unknown.form);
    await unknown.form
      .getByText(/need to check the delivery result/i)
      .waitFor();
    mailUnknown = false;
    check(
      "Unknown external delivery asks for review and blocks resubmission",
      (await unknown.form.locator('button[type="submit"]').isDisabled()) &&
        (await unknown.form
          .locator('a[href="mailto:techcrew@aihub.works"]')
          .isVisible()),
    );
    await unknown.form.evaluate((form) =>
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
    check(
      "Unknown delivery is not resent by a synthetic submit",
      report.submissions.length === beforeUnknown + 1,
    );
    await unknown.context.close();

    const interactive = await fresh({
      mode: "interactive",
      motion: "no-preference",
    });
    await fill(interactive.form);
    await interactive.page
      .getByRole("button", { name: "Verify test visitor" })
      .focus();
    await interactive.page.keyboard.press("Space");
    await send(interactive.form);
    await waitContactSuccess(interactive.form);
    check("Interactive verification is keyboard accessible");
    await interactive.context.close();

    for (const checkout of [false, true]) {
      const blocked = await fresh({ mode: "blocked", checkout });
      await fill(blocked.form, checkout);
      const beforeBlocked = report.submissions.length;
      await send(blocked.form);
      await blocked.page
        .getByText(/security check could not be completed/i)
        .first()
        .waitFor();
      check(
        `${checkout ? "Checkout" : "Contact"}: blocked script preserves input and never calls the API`,
        report.submissions.length === beforeBlocked &&
          (await blocked.form.locator('[name="email"]').inputValue()) ===
            "local@example.test",
      );
      if (checkout)
        check(
          "Blocked widget creates no pending shop submission",
          (await blocked.page.evaluate(() =>
            sessionStorage.getItem("aihub_pending_request"),
          )) === null,
        );
      await blocked.context.close();
    }
  }

  check(
    "Every submitted request has a proof header and no proof in its payload",
    report.submissions.every(
      (entry) => entry.proofPresent && !entry.bodyHasToken,
    ),
  );
  check(
    "Both action types reached the verifier",
    verification.includes("contact_submit") &&
      verification.includes("shop_submit"),
  );
  check("Local SMTP sink received notifications", smtp.messages.length > 0);
  check("No JavaScript errors", report.errors.length === 0);
  check("No missing site assets", report.failedAssets.length === 0);
  check("No external non-security writes", report.externalWrites.length === 0);
} finally {
  await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  for (const context of contexts) await context.close().catch(() => {});
  await browser.close();
  await closeVite();
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  receipts.close();
  await shop.stop();
  transport.close();
  await smtp.close();
  await fs.rm(temporary, { recursive: true, force: true });
}
