import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PREVIEW_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "/tmp/aihub-navigation-qa";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const page = await browser.newPage({ reducedMotion: "reduce" });
const report = { checks: [], errors: [], brokenAssets: [], geometry: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("response", (response) => {
  if (response.url().startsWith(base) && response.status() >= 400)
    report.brokenAssets.push(response.url());
});
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const open = async (route, lang) => {
  await page.goto(`${base}${route}?lang=${lang}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
};
await mkdir(output, { recursive: true });
try {
  for (const lang of ["ru", "en"]) {
    for (const width of [390, 768, 1199, 1200, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await open("shop.html", lang);
      const geometry = await page.evaluate(() => {
        const hero = document
          .querySelector(".shop-hero")
          .getBoundingClientRect();
        const title = document
          .querySelector("#catalog-title")
          .getBoundingClientRect();
        const button = document
          .querySelector(".shop-hero .aihub-cta-frame")
          .getBoundingClientRect();
        const header = document.querySelector(".site-header");
        const items = [
          ...header.querySelectorAll(
            ".site-logo, .site-header__navigation, .site-header__actions, .site-header__cta-frame",
          ),
        ]
          .filter((el) => getComputedStyle(el).display !== "none")
          .map((el) => el.getBoundingClientRect());
        return {
          width: innerWidth,
          overflow: document.documentElement.scrollWidth,
          gap: title.top - Math.max(hero.bottom - 16, button.bottom),
          headerFits: items.every((r) => r.left >= 0 && r.right <= innerWidth),
          overlap: items.some((r, i) =>
            items
              .slice(i + 1)
              .some(
                (s) =>
                  r.left < s.right - 1 &&
                  r.right > s.left + 1 &&
                  r.top < s.bottom &&
                  r.bottom > s.top,
              ),
          ),
        };
      });
      report.geometry.push({ lang, ...geometry });
      check(
        `${lang}/${width}: no page or header overflow`,
        geometry.overflow <= width && geometry.headerFits && !geometry.overlap,
      );
      check(
        `${lang}/${width}: compact hero-to-catalog spacing`,
        geometry.gap >= 16 && geometry.gap <= 56,
      );
      const clutter = await page.locator("main").innerText();
      check(
        `${lang}/${width}: redundant copy removed`,
        !/ВАШ НОВЫЙ КОЛЛЕГА|Демо-магазин|08 решений|USD \/|Настоящий разговор\. Не демо-заказ|YOUR NEXT TEAMMATE|Demo store|08 solutions|A real conversation\. Not a demo checkout/.test(
          clutter,
        ),
      );
      check(
        `${lang}/${width}: original logo and frame load`,
        await page.locator(".site-header img").evaluateAll(async (images) => {
          await Promise.all(images.map((i) => i.decode()));
          return images.every((i) => i.naturalWidth > 0);
        }),
      );
      if (width === 390 || width === 1200 || width === 1440)
        await page.screenshot({ path: `${output}/shop-${lang}-${width}.png` });
    }
    await page.setViewportSize({ width: 1200, height: 1000 });
    await open("shop.html", lang);
    const shopLabels = await page
      .locator(".site-header__navigation a:visible")
      .allTextContents();
    await open("", lang);
    check(
      `${lang}: common menu on both pages`,
      JSON.stringify(shopLabels) ===
        JSON.stringify(
          await page
            .locator(".site-header__navigation a:visible")
            .allTextContents(),
        ),
    );
    check(
      `${lang}: landing initializes requested locale`,
      (await page.locator("html").getAttribute("lang")) === lang,
    );
    check(
      `${lang}: shop entry in header and footer`,
      (await page.locator('a[href*="shop.html"]:visible').count()) === 2,
    );
    for (const width of [390, 1200]) {
      await page.setViewportSize({ width, height: 1000 });
      check(
        `${lang}/${width}: landing has no horizontal overflow`,
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.screenshot({ path: `${output}/landing-${lang}-${width}.png` });
    }
    await page.locator('.site-header a[href*="shop.html"]:visible').click();
    await page.waitForURL(/shop\.html/);
    check(
      `${lang}: language retained when opening shop`,
      new URL(page.url()).searchParams.get("lang") === lang,
    );
    const caseLink = page.locator('.site-header a[href$="#cases"]:visible');
    await caseLink.click();
    await page.waitForURL(/#cases$/);
    await page.waitForFunction(
      () => document.getElementById("cases")?.getBoundingClientRect().top < 100,
    );
    check(
      `${lang}: shop menu opens correct landing section`,
      (await page.locator("html").getAttribute("lang")) === lang,
    );
    await open("", lang);
    await page.locator('.site-header a[href="#roadmap"]:visible').click();
    await page.waitForFunction(
      () =>
        Math.abs(
          document.getElementById("roadmap").getBoundingClientRect().top,
        ) < 100,
    );
    check(
      `${lang}: landing navigation scrolls to section`,
      new URL(page.url()).hash === "#roadmap",
    );
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await open("shop.html", "ru");
  const menu = page.getByRole("button", { name: "Открыть меню", exact: true });
  await menu.focus();
  await page.keyboard.press("Enter");
  check(
    "Mobile menu opens with keyboard",
    (await page
      .getByRole("button", { name: "Закрыть меню", exact: true })
      .getAttribute("aria-expanded")) === "true",
  );
  check(
    "Mobile menu receives focus",
    await page
      .locator(".site-header__navigation")
      .evaluate((nav) => nav.contains(document.activeElement)),
  );
  await page.screenshot({ path: `${output}/mobile-menu.png` });
  await page.keyboard.press("Escape");
  check(
    "Escape closes menu and restores focus",
    await menu.evaluate(
      (button) =>
        document.activeElement === button &&
        button.getAttribute("aria-expanded") === "false",
    ),
  );
  await menu.click();
  await page.setViewportSize({ width: 1200, height: 900 });
  check(
    "Resizing to desktop restores horizontal menu",
    await page
      .locator(".site-header__navigation")
      .evaluate((nav) => getComputedStyle(nav).display === "flex"),
  );

  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const route of ["shop.html", ""]) {
    await page.goto(`${base}${route}?lang=en`, {
      waitUntil: "domcontentloaded",
    });
    const title = page
      .locator("h1:visible")
      .filter({ has: page.locator(".site-typewriter") });
    await title.waitFor();
    const initial = await title.boundingBox();
    await page.waitForFunction(() => {
      const title = [...document.querySelectorAll("h1")].find(
        (el) => el.getClientRects().length > 0,
      );
      const node = title?.querySelector(".site-typewriter");
      return (
        node?.getAttribute("data-typing-done") === "false" &&
        node.querySelector(".site-typewriter__ink").textContent.length > 0
      );
    });
    check(`${route || "landing"}: title types progressively`, true);
    await title.locator('[data-typing-done="true"]').waitFor();
    const final = await title.boundingBox();
    check(
      `${route || "landing"}: title reserves its final height`,
      Math.abs(initial.height - final.height) < 1,
    );
    check(
      `${route || "landing"}: blinking cursor remains`,
      (await title.locator(".site-typewriter__cursor").count()) === 1 &&
        (await title
          .locator(".site-typewriter__cursor")
          .evaluate(
            (el) => getComputedStyle(el).animationName === "site-cursor-blink",
          )),
    );
    await page.getByRole("button", { name: "Switch to Russian" }).click();
    await title.locator('[data-typing-done="false"]').waitFor();
    check(`${route || "landing"}: locale change restarts typing`, true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await title.locator('[data-typing-done="true"]').waitFor();
    check(
      `${route || "landing"}: reduced motion shows final title without cursor`,
      (await title.locator(".site-typewriter__cursor").count()) === 0,
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  check("No runtime errors", report.errors.length === 0);
  check("No missing local assets", report.brokenAssets.length === 0);
} finally {
  await writeFile(
    `${output}/report.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
