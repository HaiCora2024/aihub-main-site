import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = new URL(process.env.QA_URL || "http://127.0.0.1:4186/");
const output = process.env.QA_OUTPUT || "tmp/site-interactions";
const api = "https://aihub-form-getcher.waw0.amvera.tech";
const liveCatalog = await (await fetch(`${api}/api/shop/catalog`)).text();
const report = { checks: [], errors: [], attemptedWrites: [] };
const browser = await chromium.launch({ headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
await fs.mkdir(output, { recursive: true });
const check = (name, condition = true) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};

try {
  for (const lang of ["en", "ru"]) {
    for (const width of [390, 1440]) {
      const label = `${lang}/${width}`;
      const context = await browser.newContext({ viewport: { width, height: 1000 },
        reducedMotion: "reduce", isMobile: width < 768, hasTouch: width < 768 });
      try {
        await context.route("**/*", (route) => {
          const request = route.request();
          // Local previews use a read-only snapshot to avoid production CORS and writes.
          if (request.url() === `${api}/api/shop/catalog` && request.method() === "GET")
            return route.fulfill({ contentType: "application/json", body: liveCatalog,
              headers: { "Access-Control-Allow-Origin": "*" } });
          if (["GET", "HEAD", "OPTIONS"].includes(request.method())) return route.continue();
          if (new URL(request.url()).hostname === "challenges.cloudflare.com") return route.continue();
          if (request.url().startsWith(api)) report.attemptedWrites.push(request.url());
          return route.abort();
        });
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        page.on("pageerror", (error) => report.errors.push(error.message));
        const open = async (route = "") => {
          await page.goto(new URL(`${route}?lang=${lang}`, base).href, { waitUntil: "domcontentloaded" });
          await page.locator("h1").first().waitFor({ state: "attached" });
        };
        await open();
        check(`${label}: footer telephone is actionable`,
          await page.locator('#footer a[href="tel:+4915774490172"]').count() === 1);
        check(`${label}: footer email is actionable`,
          await page.locator('#footer a[href="mailto:techcrew@aihub.works"]').count() >= 1);
        if (width < 768) {
          const menu = page.locator(".site-header__menu-button");
          check(`${label}: mobile menu initially closed`, await page.locator(".site-header__navigation").isHidden());
          await menu.tap();
          check(`${label}: tapping hamburger opens navigation`, await page.locator(".site-header__navigation").isVisible());
          await page.keyboard.press("Escape");
          check(`${label}: Escape closes menu and returns focus`, await menu.evaluate((el) =>
            document.activeElement === el && el.getAttribute("aria-expanded") === "false"));
          await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
          await page.locator('.site-header[data-compact="true"]').waitFor();
          check(`${label}: scrolling never expands menu`, await page.locator(".site-header__navigation").isHidden());
          check(`${label}: docked hamburger and logo remain available`, await menu.isVisible() &&
            await page.locator(".site-header .site-logo").isVisible());
          await menu.tap();
          check(`${label}: docked hamburger opens navigation`, await page.locator(".site-header__navigation").isVisible());
          await page.screenshot({ path: path.join(output, `menu-${label.replace("/", "-")}.png`) });
          await page.keyboard.press("Escape");
          check(`${label}: docked menu collapses again`, await page.locator(".site-header__navigation").isHidden());
        }
        for (const selector of [".glow-button--yellow", ".glow-button--orange", "#demo .glow-button"]) {
          const button = page.locator(`${selector}:visible`).first();
          await button.scrollIntoViewIfNeeded();
          if (selector === ".glow-button--yellow") {
            check(`${label}: yellow outline visibility`, (await page.locator(".results-cta__frame:visible").count()) === (width < 768 ? 0 : 1));
            if (width >= 768) {
              check(`${label}: local yellow outline loads`, await page.locator(".results-cta__frame:visible").evaluate(async (img) => {
                await img.decode();
                return img.naturalWidth === 330 && new URL(img.src).origin === location.origin;
              }));
              check(`${label}: yellow button aligns with its frame`, await button.evaluate((el) => {
                const b = el.getBoundingClientRect(), f = el.parentElement.getBoundingClientRect();
                return Math.abs(b.left + b.width / 2 - f.left - f.width / 2) < 1;
              }));
            }
            await page.screenshot({ path: path.join(output, `yellow-${label.replace("/", "-")}.png`) });
          }
          await button.click();
          await page.waitForFunction(() => {
            const top = document.getElementById("contact").getBoundingClientRect().top;
            const header = document.querySelector(".site-header__inner").getBoundingClientRect().bottom;
            return top >= header - 1 && top <= header + 120;
          });
          check(`${label}: ${selector} opens unobscured contact form`);
          check(`${label}: CTA respects reduced motion`, await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === "auto"));
        }
        await page.locator(".glow-button--yellow:visible").focus();
        await page.keyboard.press("Tab");
        await page.keyboard.press("Shift+Tab");
        check(`${label}: CTA keyboard focus is visible`, await page.locator(".glow-button--yellow:visible").evaluate((el) =>
          parseFloat(getComputedStyle(el).outlineWidth) >= 2));

        for (const slug of ["hotel-concierge", "order-processing-1c", "rental-platform"]) {
          await open();
          await page.locator(`#cases a[href*="cases/${slug}.html"]`).click();
          await page.waitForURL(new RegExp(`cases/${slug}\\.html`));
          await page.waitForFunction((lang) => document.documentElement.lang === lang, lang);
          check(`${label}: ${slug} opens in the selected language`);
          await page.locator('nav a[href*="#cases"]').first().click();
          await page.waitForURL(/#cases$/);
          await page.waitForFunction((lang) => document.documentElement.lang === lang, lang);
          check(`${label}: ${slug} returns to the same landing language`,
            new URL(page.url()).searchParams.get("lang") === lang);
        }

        await open("shop.html");
        const cards = page.locator(".shop-product-card");
        await page.waitForFunction(() => document.querySelectorAll(".shop-product-card").length === 8);
        check(`${label}: catalog shows eight products`, await cards.count() === 8);
        const productName = await cards.first().locator("h3").innerText();
        const search = page.locator('input[type="search"]');
        await search.fill(productName);
        await page.waitForFunction(() => document.querySelectorAll(".shop-product-card").length === 1);
        check(`${label}: catalog search finds the product`, await cards.count() === 1);
        await search.fill("no-matching-product-qa");
        await page.locator(".shop-empty-results").waitFor();
        check(`${label}: empty search state works`, await cards.count() === 0);
        await search.fill("");
        await page.waitForFunction(() => document.querySelectorAll(".shop-product-card").length === 8);
        await page.locator(".shop-filter").nth(1).click();
        await page.waitForFunction(() => { const n = document.querySelectorAll(".shop-product-card").length; return n > 0 && n < 8; });
        check(`${label}: category filter works`);
        await page.locator(".shop-filter").first().click();
        await page.waitForFunction(() => document.querySelectorAll(".shop-product-card").length === 8);
        await cards.first().locator("a.aihub-button").click();
        await page.waitForURL(/shop\/voice-assistant\.html/);
        check(`${label}: product link keeps language`, new URL(page.url()).searchParams.get("lang") === lang);
        const packages = page.locator(".shop-pdp-package");
        check(`${label}: product packages are available`, await packages.count() === 3);
        for (const index of [0, 1]) {
          await packages.nth(index).locator("button").click();
          await page.getByRole("dialog").waitFor();
          check(`${label}: choosing package ${index + 1} opens cart`, await page.locator(".shop-cart-line").count() === index + 1);
          if (index === 0) {
            await page.keyboard.press("Escape");
            check(`${label}: cart close restores package focus`, await packages.nth(index).locator("button").evaluate((el) => document.activeElement === el));
          }
        }
        await page.locator(".shop-cart-summary .aihub-button").click();
        await page.waitForURL(/checkout\.html/);
        await page.locator(".checkout-form").waitFor();
        check(`${label}: checkout keeps language`, new URL(page.url()).searchParams.get("lang") === lang);
        check(`${label}: terms are not preselected`, !(await page.locator('[name="termsAccepted"]').isChecked()));
        check(`${label}: required contact fields are present`, await page.locator('[name="name"]').getAttribute("required") !== null &&
          await page.locator('[name="email"]').getAttribute("required") !== null);
        for (const route of ["legal/privacy-policy.html", "legal/terms.html"]) {
          await open(route);
          check(`${label}: ${route} has company contacts`, await page.locator(".company-details").count() === 1 &&
            await page.locator('a[href="mailto:sales@aihubworks.com"]').count() > 0);
          check(`${label}: ${route} keeps document language`, await page.locator("html").getAttribute("lang") === lang);
          check(`${label}: ${route} links back to localized checkout`,
            new URL(await page.locator('.legal-links a[href*="checkout"]').getAttribute("href"), base).searchParams.get("lang") === lang);
        }
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await open();
        await page.evaluate(() => scrollTo({ top: 500, behavior: "instant" }));
        await page.locator('.site-header[data-compact="true"]').waitFor();
        check(`${label}: motion mode has no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      } finally {
        await context.close();
      }
    }
  }
  check("No runtime errors", report.errors.length === 0);
  check("No API writes attempted", report.attemptedWrites.length === 0);
} finally {
  await fs.writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
