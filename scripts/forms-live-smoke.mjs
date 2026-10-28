import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = new URL(process.env.QA_URL || "https://aihub.works/");
const api = "https://aihub-form-getcher.waw0.amvera.tech";
const output = process.env.QA_OUTPUT || "/tmp/aihub-forms-live-qa";
const report = { checks: [], errors: [], failedAssets: [], blockedFormWrites: [] };
await fs.mkdir(output, { recursive: true });
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});

try {
  for (const lang of ["en", "ru"]) {
    for (const checkout of [false, true]) {
      const label = `${lang}/${checkout ? "checkout" : "contact"}`;
      const context = await browser.newContext({
        viewport: { width: 390, height: 1000 },
        reducedMotion: "reduce",
      });
      try {
        await context.route("**/*", (route) => {
          const request = route.request();
          if (["GET", "HEAD", "OPTIONS"].includes(request.method()))
            return route.continue();
          if (new URL(request.url()).hostname === "challenges.cloudflare.com")
            return route.continue();
          if (request.url().startsWith(api))
            report.blockedFormWrites.push(new URL(request.url()).pathname);
          return route.abort();
        });
        const page = await context.newPage();
        page.on("pageerror", (error) => report.errors.push(error.message));
        page.on("response", (response) => {
          if (response.url().startsWith(base.origin) && response.status() >= 400)
            report.failedAssets.push(response.url());
        });
        if (checkout) {
          await page.goto(new URL(`shop.html?lang=${lang}`, base).href);
          await page.evaluate(() =>
            localStorage.setItem(
              "aihub_cart",
              JSON.stringify([{ id: 1, packageId: "start", qty: 1 }]),
            ),
          );
        }
        await page.goto(
          new URL(checkout ? `checkout.html?lang=${lang}` : `?lang=${lang}`, base)
            .href,
        );
        const form = page.locator(
          checkout ? ".checkout-form" : 'form[tool-name="book-consultation"]',
        );
        await form.waitFor();
        if (checkout)
          await page.waitForFunction(
            () => !document.querySelector('button[type="submit"]')?.disabled,
          );
        check(`${label}: security check is lazy`,
          (await page.locator(".form-security").count()) === 0);
        await form.locator('[name="name"]').focus();
        // Turnstile owns a closed shadow root; inspect the browser's frame tree.
        const deadline = Date.now() + 30000;
        while (!page.frames().some((frame) =>
          frame.url().startsWith("https://challenges.cloudflare.com/")) &&
          Date.now() < deadline)
          await page.waitForTimeout(100);
        check(`${label}: real Cloudflare challenge rendered`,
          page.frames().some((frame) =>
            frame.url().startsWith("https://challenges.cloudflare.com/")));
        check(`${label}: no customer data entered`,
          (await form.locator('[name="name"]').inputValue()) === "" &&
          (await form.locator('[name="email"]').inputValue()) === "");
        for (const width of [390, 768, 1199, 1200, 1440, 1920]) {
          await page.setViewportSize({ width, height: 1000 });
          check(`${label}/${width}: no horizontal overflow`,
            await page.evaluate(() =>
              document.documentElement.scrollWidth <= innerWidth));
        }
        await page.setViewportSize({ width: 390, height: 1000 });
        await form.locator('[name="email"]').scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `${label.replace("/", "-")}.png`) });
      } finally {
        await context.close();
      }
    }
  }
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(new URL("legal/privacy-policy.html?lang=en", base).href);
    check("Published privacy policy includes Turnstile",
      (await page.locator("main").innerText()).includes("Cloudflare Turnstile"));
  } finally {
    await context.close();
  }
  check("No JavaScript errors", report.errors.length === 0);
  check("No missing published assets", report.failedAssets.length === 0);
  check("No form submissions attempted", report.blockedFormWrites.length === 0);
} finally {
  await fs.writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
