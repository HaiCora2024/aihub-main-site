import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import seller from "../backend/contact-api/shared/seller.json" with { type: "json" };

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4176/";
const output = process.env.QA_OUTPUT || "/tmp/aihub-company-qa";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const page = await browser.newPage({ reducedMotion: "reduce" });
const report = { checks: [], errors: [], brokenAssets: [] };
page.on("pageerror", (e) => report.errors.push(e.message));
page.on("response", (r) => {
  if (r.url().startsWith(base) && r.status() >= 400)
    report.brokenAssets.push(r.url());
});
// Never exercise submission endpoints or the legacy third-party chat in this UI check.
await page.route("**/*", async (route) => {
  const req = route.request();
  if (req.method() === "POST" || /aihub-plugin|chat-widget/i.test(req.url()))
    return route.abort();
  return route.continue();
});
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const routes = [
  "",
  "shop.html",
  "checkout.html",
  "legal/privacy-policy.html",
  "legal/terms.html",
];
const cases = [
  "hotel-concierge",
  "real-estate",
  "order-processing-1c",
  "robotics-fleet",
  "claude-code-landing",
  "partner-kpi",
  "clinic-voice-ai",
  "telegram-sentiment",
  "bank-360-review",
  "kyb-screening",
  "ad-moderation",
  "multilang-digest",
  "omni-crm",
  "rental-platform",
];
await mkdir(output, { recursive: true });
try {
  for (const lang of ["en", "ru"]) {
    for (const width of [390, 768, 1199, 1200, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await page.goto(`${base}${route}?lang=${lang}`, {
          waitUntil: "domcontentloaded",
        });
        await page.locator("#company-details").waitFor();
        const text = await page.locator("#company-details").innerText();
        check(
          `${route || "home"}/${lang}/${width}: all company data`,
          [
            seller.name,
            seller.address,
            seller.nip,
            seller.krs,
            seller.regon,
            seller.capital,
            seller.court,
            seller.salesEmail,
            seller.privacyEmail,
          ].every((v) => text.includes(v)),
        );
        check(
          `${route || "home"}/${lang}/${width}: header and no overflow`,
          await page.evaluate(() => {
            const link = document
              .querySelector(".site-header__company")
              .getBoundingClientRect();
            return (
              document.documentElement.scrollWidth <= innerWidth &&
              link.width > 0 &&
              link.left >= 0 &&
              link.right <= innerWidth
            );
          }),
        );
        await page.locator(".site-header__company").click();
        check(
          `${route || "home"}/${lang}/${width}: anchor and keyboard focus`,
          await page.evaluate(
            () =>
              location.hash === "#company-details" &&
              document.activeElement?.id === "company-details",
          ),
        );
        if (width === 390 || width === 1440) {
          await page.screenshot({
            path: `${output}/${route.replaceAll("/", "-") || "home"}-${lang}-${width}-details.png`,
          });
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({
            path: `${output}/${route.replaceAll("/", "-") || "home"}-${lang}-${width}-header.png`,
          });
        }
      }
    }
  }
  for (const slug of cases) {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`${base}cases/${slug}.html`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("#company-details").waitFor();
    check(
      `${slug}: company footer and legal links`,
      (await page.locator("#company-details").innerText()).includes(
        seller.court,
      ) && (await page.locator(".company-footer nav a").count()) === 2,
    );
    check(
      `${slug}: footer fits`,
      await page
        .locator(".company-footer")
        .evaluate((el) => el.scrollWidth <= innerWidth),
    );
  }
  check("no JavaScript errors", report.errors.length === 0);
  check("no missing local assets", report.brokenAssets.length === 0);
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
