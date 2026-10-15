import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { createServer as createVite, build, preview } from "vite";
import { createServer } from "../backend/contact-api/server.js";
import { createShopService } from "../backend/contact-api/shop/service.js";
import { publicCatalog } from "../backend/contact-api/shop/contract.js";
import { startSmtpSink } from "../backend/contact-api/test/smtp-sink.js";

const require = createRequire(
  new URL("../backend/contact-api/package.json", import.meta.url),
);
const nodemailer = require("nodemailer");
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const output = process.env.QA_OUTPUT || "/tmp/aihub-checkout-qa";
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "aihub-checkout-"));
await fs.mkdir(output, { recursive: true });
const report = {
  checks: [],
  errors: [],
  externalRequests: [],
  failedAssets: [],
  layouts: [],
  accessibility: [],
};
const AxeBuilder = process.env.AXE_MODULE
  ? (await import(process.env.AXE_MODULE)).default
  : null;
const check = (name, condition = true) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const smtp = await startSmtpSink();
const transport = nodemailer.createTransport(smtp.transportOptions);
const origins = [];
const logs = [];
const shop = createShopService({
  filename: path.join(temporary, "shop.sqlite"),
  origins,
  from: "AIHUB <test@example.test>",
  sendMail: (mail) => transport.sendMail(mail),
  limit: 1000,
  log: (entry) => logs.push(entry),
});
const api = createServer({ shopService: shop });
await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
const apiUrl = `http://127.0.0.1:${api.address().port}`;
process.env.VITE_SHOP_API_URL = apiUrl;
const prefix = process.env.QA_BASE || "/";
let vite;
let closeVite;
if (process.env.QA_PRODUCTION === "true") {
  const outDir = path.join(temporary, "dist");
  await build({
    base: prefix,
    logLevel: "warn",
    build: { outDir, emptyOutDir: true },
  });
  vite = await preview({
    base: prefix,
    logLevel: "warn",
    build: { outDir },
    preview: { host: "127.0.0.1", port: 0 },
  });
  closeVite = () => new Promise((resolve) => vite.httpServer.close(resolve));
} else {
  vite = await createVite({
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
async function fresh(lang = "en", items = [{ id: 1, qty: 1 }]) {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  contexts.push(context);
  context.on("response", (response) => {
    if (new URL(response.url()).origin === origin && response.status() >= 400)
      report.failedAssets.push(response.url());
  });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if ([origin, apiUrl].includes(url.origin)) return route.continue();
    report.externalRequests.push(url.origin);
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("pageerror", (error) => report.errors.push(error.message));
  await page.goto(`${base}shop.html?lang=${lang}`);
  await page.evaluate(
    (value) => localStorage.setItem("aihub_cart", JSON.stringify(value)),
    items,
  );
  await page.goto(`${base}checkout.html?lang=${lang}`);
  await page.locator('button[type="submit"]').waitFor();
  await page.waitForFunction(
    () => !document.querySelector('button[type="submit"]').disabled,
  );
  return { page, context };
}
async function fill(page) {
  for (const [name, value] of Object.entries({
    name: "QA Buyer",
    email: "qa-buyer@example.test",
    address: "QA Address 123",
    city: "Poznan",
    postalCode: "60-001",
  }))
    await page.locator(`[name="${name}"]`).fill(value);
  await page.locator('[name="country"]').selectOption("PL");
  await page.locator('[name="termsAccepted"]').check();
}
const storage = (page) =>
  page.evaluate(() =>
    JSON.stringify({
      local: { ...localStorage },
      session: { ...sessionStorage },
    }),
  );
const success = async (page) => {
  await page.locator(".checkout-success").waitFor();
  return page.locator(".checkout-reference strong").innerText();
};
async function close(context) {
  await context.close();
  contexts.splice(contexts.indexOf(context), 1);
}

async function accessibility(page, name) {
  if (!AxeBuilder) return;
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.accessibility.push({ name, violations: result.violations });
  check(
    `${name}: no automated WCAG A/AA violations`,
    result.violations.length === 0,
  );
}

try {
  for (const lang of ["en", "ru"]) {
    const { page, context } = await fresh(lang);
    for (const width of [390, 768, 1199, 1200, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => ({
        width: innerWidth,
        scroll: document.documentElement.scrollWidth,
        inputs: [
          ...document.querySelectorAll(
            'input:not([type="radio"]):not([name="website"]),select,textarea',
          ),
        ].every((el) => el.getBoundingClientRect().right <= innerWidth),
      }));
      check(
        `${lang}/${width}: checkout fits viewport`,
        geometry.scroll <= width && geometry.inputs,
      );
      report.layouts.push({ lang, ...geometry });
      if ([390, 1440].includes(width))
        await page.screenshot({
          path: `${output}/checkout-${lang}-${width}.png`,
          fullPage: true,
        });
    }
    await accessibility(page, `checkout/${lang}`);
    await close(context);
  }

  {
    const { page, context } = await fresh();
    const before = shop.store.stats().requests;
    check(
      "Terms start unchecked",
      !(await page.locator('[name="termsAccepted"]').isChecked()),
    );
    await page.locator('button[type="submit"]').click();
    check(
      "Invalid fields are marked and focused",
      await page
        .locator('[name="name"]')
        .evaluate(
          (el) =>
            el === document.activeElement &&
            el.getAttribute("aria-invalid") === "true",
        ),
    );
    check(
      "Invalid form sends no request",
      shop.store.stats().requests === before,
    );
    await fill(page);
    check(
      "No customer fields in browser storage",
      !/QA Buyer|qa-buyer@|QA Address|60-001/.test(await storage(page)),
    );
    const popupPromise = page.waitForEvent("popup");
    await page.locator('.checkout-consents a[href*="terms.html"]').click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    check(
      "Legal link opens separately with shared header",
      await popup.locator(".site-header").isVisible(),
    );
    check(
      "Opening legal terms preserves form",
      (await page.locator('[name="email"]').inputValue()) ===
        "qa-buyer@example.test",
    );
    await popup.close();
    await page.locator("form").evaluate((form) => {
      form.requestSubmit();
      form.requestSubmit();
    });
    const id = await success(page);
    check(
      "Double submit produces one durable request",
      shop.store.stats().requests === before + 1,
    );
    check(
      "Receipt contains no billing data",
      !/QA Buyer|QA Address|qa-buyer@/.test(
        await page.locator(".checkout-success").innerText(),
      ),
    );
    check(
      "Accepted cart consumed",
      (await page.evaluate(() => localStorage.getItem("aihub_cart"))) === "[]",
    );
    check(
      "Success keyboard focus",
      await page
        .locator(".checkout-success h1")
        .evaluate((el) => el === document.activeElement),
    );
    check(
      "Pending secret removed after success",
      !(await page.evaluate(() =>
        sessionStorage.getItem("aihub_pending_request"),
      )),
    );
    check(
      "Server stores terms versions and timestamp",
      !!shop.store.exportRequest(id).terms_version &&
        shop.store.exportRequest(id).created_at > 0,
    );
    await close(context);
  }

  for (const registered of [true, false]) {
    const { page, context } = await fresh("ru");
    await fill(page);
    await page.locator('[name="type"][value="business"]').check();
    await page.locator('[name="companyName"]').fill("QA Company");
    await page.locator(`[name="vatRegistered"][value="${registered}"]`).check();
    if (registered) {
      await page.locator('button[type="submit"]').click();
      check(
        "VAT ID required when registered",
        (await page.locator('[name="vatId"]').getAttribute("aria-invalid")) ===
          "true",
      );
      await page.locator('[name="vatId"]').fill("PL1234567890");
    } else
      check(
        "No VAT ID field when not registered",
        !(await page.locator('[name="vatId"]').count()),
      );
    await page.locator('button[type="submit"]').click();
    const id = await success(page);
    check(
      `RU B2B saved with VAT ${registered}`,
      shop.store.exportRequest(id).payload.billing.vatRegistered === registered,
    );
    await close(context);
  }

  {
    const { page, context } = await fresh();
    await fill(page);
    const other = await context.newPage();
    await other.goto(`${base}shop.html`);
    let release;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    await page.route(`${apiUrl}/api/shop/requests`, async (route) => {
      await gate;
      await route.continue();
    });
    await page.locator('button[type="submit"]').click();
    await page.waitForFunction(
      () => !!sessionStorage.getItem("aihub_pending_request"),
    );
    await other.evaluate(() =>
      localStorage.setItem(
        "aihub_cart",
        JSON.stringify([
          { id: 1, qty: 3 },
          { id: 2, qty: 1 },
        ]),
      ),
    );
    release();
    await success(page);
    const remaining = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("aihub_cart")),
    );
    check(
      "Concurrent cart additions survive acceptance",
      JSON.stringify(remaining) ===
        JSON.stringify([
          { id: 1, qty: 2 },
          { id: 2, qty: 1 },
        ]),
    );
    await other.close();
    await close(context);
  }

  {
    const { page, context } = await fresh();
    await fill(page);
    const before = shop.store.stats().requests;
    await page.route(`${apiUrl}/api/shop/requests`, async (route) => {
      await route.fetch();
      // Persist first, then exceed the browser's real 12-second request deadline.
      await new Promise((resolve) => setTimeout(resolve, 13000));
      await route.abort("failed").catch(() => {});
    });
    await page.locator('button[type="submit"]').click();
    await page.getByRole("button", { name: "Check request status" }).waitFor();
    check(
      "Lost response keeps form in memory",
      (await page.locator('[name="email"]').inputValue()) ===
        "qa-buyer@example.test",
    );
    check(
      "Unknown state stores no PII",
      !/QA Buyer|qa-buyer@|QA Address|60-001/.test(await storage(page)),
    );
    await page.reload();
    await success(page);
    check(
      "Reload recovers accepted request without resubmission",
      shop.store.stats().requests === before + 1,
    );
    await close(context);
  }

  {
    const { page, context } = await fresh();
    await fill(page);
    const keys = [];
    let fail = true;
    await page.route(`${apiUrl}/api/shop/requests`, async (route) => {
      keys.push(route.request().headers()["idempotency-key"]);
      if (fail) {
        fail = false;
        await route.abort("failed");
      } else await route.continue();
    });
    await page.locator('button[type="submit"]').click();
    await page.getByRole("button", { name: "Check request status" }).click();
    await page
      .getByText("Acceptance is not confirmed yet.", { exact: false })
      .waitFor();
    await page.getByRole("button", { name: "Retry the same request" }).click();
    await success(page);
    check(
      "Unaccepted network failure retries the same 256-bit key",
      keys.length === 2 &&
        keys[0] === keys[1] &&
        /^[a-f0-9]{64}$/.test(keys[0]),
    );
    await close(context);
  }

  {
    const { page, context } = await fresh();
    await fill(page);
    await page.route(`${apiUrl}/api/shop/requests`, (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "LEGAL_CHANGED" } }),
      }),
    );
    await page.locator('button[type="submit"]').click();
    await page
      .getByText("The catalog or documents have changed.", { exact: false })
      .waitFor();
    check(
      "Changed terms require fresh acknowledgement and keep fields",
      !(await page.locator('[name="termsAccepted"]').isChecked()) &&
        (await page.locator('[name="email"]').inputValue()) ===
          "qa-buyer@example.test",
    );
    await page.unroute(`${apiUrl}/api/shop/requests`);
    await page.route(`${apiUrl}/api/shop/catalog`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...publicCatalog(),
          legal: { ...publicCatalog().legal, termsVersion: "future" },
        }),
      }),
    );
    await page.reload();
    await page
      .getByText("The published documents and API versions do not match.", {
        exact: false,
      })
      .waitFor();
    check(
      "Unpublished legal version disables sending",
      await page.locator('button[type="submit"]').isDisabled(),
    );
    await close(context);
  }

  {
    const { page, context } = await fresh();
    await page.route(`${apiUrl}/api/shop/catalog`, (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "SHOP_UNAVAILABLE" } }),
      }),
    );
    await page.reload();
    await page.getByRole("button", { name: "Check availability" }).waitFor();
    check(
      "Offline API fails closed, no demo success",
      (await page.locator('button[type="submit"]').isDisabled()) &&
        !(await page.locator(".checkout-success").count()),
    );
    await close(context);
  }

  for (const [status, code] of [
    [400, "VALIDATION_ERROR"],
    [429, "RATE_LIMITED"],
    [200, "MALFORMED_SUCCESS"],
  ]) {
    const { page, context } = await fresh();
    await fill(page);
    await page.route(`${apiUrl}/api/shop/requests`, (route) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(
          status === 200
            ? { request: { status: "paid" } }
            : { error: { code, fields: { city: "invalid" } } },
        ),
      }),
    );
    await page.locator('button[type="submit"]').click();
    await page.locator(".checkout-notice").waitFor();
    check(
      `${code}: input and cart preserved, no false success`,
      (await page.locator('[name="email"]').inputValue()) ===
        "qa-buyer@example.test" &&
        !(await page.locator(".checkout-success").count()) &&
        (await page.evaluate(
          () => JSON.parse(localStorage.getItem("aihub_cart")).length,
        )) === 1,
    );
    if (status === 400)
      check(
        "Server field error is accessible",
        (await page.locator('[name="city"]').getAttribute("aria-invalid")) ===
          "true",
      );
    check(
      `${code}: no PII persisted`,
      !/QA Buyer|qa-buyer@|QA Address/.test(await storage(page)),
    );
    await close(context);
  }

  {
    const { page, context } = await fresh();
    for (const lang of ["en", "ru"])
      for (const kind of ["privacy-policy", "terms"]) {
        await page.goto(`${base}legal/${kind}.html?lang=${lang}`);
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.evaluate(() => document.fonts.ready);
          check(
            `${kind}/${lang}/${width}: legal page fits`,
            await page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          if (lang === "ru")
            await page.screenshot({
              path: `${output}/${kind}-${lang}-${width}.png`,
              fullPage: true,
            });
        }
        check(
          `${kind}/${lang}: company details and no chat`,
          (await page.locator("main").innerText()).includes("0001200571") &&
            !(await page.locator('script[src*="embed-chat"]').count()),
        );
        check(
          `${kind}/${lang}: return URL respects base`,
          (
            await page
              .locator('.legal-links a[href*="checkout.html"]')
              .getAttribute("href")
          ).startsWith(prefix),
        );
        await accessibility(page, `${kind}/${lang}`);
      }
    await close(context);
  }

  await shop.drain();
  for (
    let i = 0;
    i < 100 && shop.store.stats().outbox.some((row) => row.state !== "sent");
    i++
  )
    await new Promise((resolve) => setTimeout(resolve, 20));
  check(
    "Two local SMTP deliveries per saved request",
    smtp.messages.length === shop.store.stats().requests * 2,
  );
  check(
    "No PII in application logs",
    !/QA Buyer|qa-buyer@|QA Address|60-001/.test(JSON.stringify(logs)),
  );
  check("No JavaScript errors", report.errors.length === 0);
  check("No missing local assets", report.failedAssets.length === 0);
  check(
    "No third-party font, chat or analytics requests",
    report.externalRequests.length === 0,
  );
} finally {
  await fs.writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  for (const context of contexts) await context.close();
  await browser.close();
  await closeVite();
  api.closeAllConnections();
  await new Promise((resolve) => api.close(resolve));
  await shop.stop();
  transport.close();
  await smtp.close();
  await fs.rm(temporary, { recursive: true, force: true });
}
