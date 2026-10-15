import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.PREVIEW_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "/tmp/aihub-sticky-cart-qa";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const report = { checks: [], errors: [], failedAssets: [], writes: [] };
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("response", (response) => {
  if (response.url().startsWith(base) && response.status() >= 400)
    report.failedAssets.push(response.url());
});
await page.route("**/*", (route) => {
  if (["GET", "HEAD", "OPTIONS"].includes(route.request().method()))
    return route.continue();
  report.writes.push(route.request().url());
  return route.abort();
});
await mkdir(output, { recursive: true });
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const scroll = async (y, pinned) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForFunction(
    (expected) => document.querySelector(".shop-cart-trigger")
      .classList.contains("shop-cart-trigger--pinned") === expected,
    pinned,
  );
};
const geometry = () => page.locator(".shop-cart-trigger").evaluate((button) => {
  const box = button.getBoundingClientRect();
  const target = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
  return {
    top: box.top,
    visible: box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth,
    clickable: button.contains(target),
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
});

try {
  for (const lang of ["en", "ru"]) {
    await page.goto(`${base}shop.html?lang=${lang}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 390, 768, 1199, 1200, 1440, 1920]) {
      const label = `${lang}/${width}`;
      await page.setViewportSize({ width, height: 900 });
      await scroll(0, false);
      const layout = await page.locator(".shop-cart-anchor").evaluate((anchor) => ({
        top: anchor.getBoundingClientRect().top + scrollY,
        height: document.documentElement.scrollHeight,
      }));
      await scroll(Math.max(0, layout.top - 100), false);
      check(`${label}: original button remains in flow`, (await geometry()).visible);
      await scroll(layout.top + 60, true);
      let box = await geometry();
      check(`${label}: pins at 16px without overflow`, box.visible && box.clickable && !box.overflow && Math.abs(box.top - 16) < 1);
      check(`${label}: pinning preserves page height`, await page.evaluate(
        (height) => Math.abs(document.documentElement.scrollHeight - height) < 1,
        layout.height,
      ));
      for (const position of [layout.height / 2, layout.height]) {
        await scroll(position, true);
        box = await geometry();
        check(`${label}/${position === layout.height ? "footer" : "catalog"}: visible and clickable`, box.visible && box.clickable);
      }
      const before = await page.evaluate(() => scrollY);
      await page.locator(".shop-cart-trigger").click();
      check(`${label}: opens from footer`, await page.locator("dialog").evaluate((dialog) => dialog.matches(":modal")));
      await page.keyboard.press("Escape");
      await page.waitForSelector("dialog", { state: "detached" });
      check(`${label}: Escape restores focus without scroll jump`, await page.evaluate(
        (previous) => document.activeElement === document.querySelector(".shop-cart-trigger") && Math.abs(scrollY - previous) < 1,
        before,
      ));
      await page.mouse.move(0, 0);
      if ([390, 1440].includes(width))
        await page.screenshot({ path: `${output}/${lang}-${width}-pinned.png` });
      await scroll(0, false);
      check(`${label}: returns to original slot`, await page.locator(".shop-cart-trigger").evaluate(
        (button) => getComputedStyle(button).position !== "fixed" && document.querySelectorAll(".shop-cart-trigger").length === 1,
      ));
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}shop.html?lang=en`, { waitUntil: "networkidle" });
  await page.locator(".shop-product-card .aihub-button").last().click();
  await page.waitForSelector(".shop-cart-trigger--pinned");
  check("Pinned counter updates after adding a product", await page.locator(".shop-cart-count").innerText() === "1");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(".shop-cart-trigger--pinned");
  check("Reload restores scrolled position and cart", await page.locator(".shop-cart-count").innerText() === "1" && (await geometry()).clickable);
  await page.setViewportSize({ width: 1440, height: 900 });
  await scroll(await page.evaluate(() => document.documentElement.scrollHeight), true);
  check("Resize while pinned keeps cart reachable", (await geometry()).clickable);
  check("No JavaScript errors", report.errors.length === 0);
  check("No failed site assets", report.failedAssets.length === 0);
  check("No external writes", report.writes.length === 0);
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
