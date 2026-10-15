import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PREVIEW_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "/tmp/aihub-shop-qa";
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : {}),
});
const context = await browser.newContext({
  reducedMotion: "reduce",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const report = {
  checks: [],
  geometry: [],
  errors: [],
  failedAssets: [],
  writes: [],
};
page.on("pageerror", (error) => report.errors.push(error.message));
page.on("response", (response) => {
  if (response.url().startsWith(base) && response.status() >= 400)
    report.failedAssets.push(response.url());
});
page.on("request", (request) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method()))
    report.writes.push(request.url());
});
await mkdir(output, { recursive: true });
const check = (name, condition) => {
  assert.ok(condition, name);
  report.checks.push(name);
  console.log("PASS", name);
};
const open = async (lang = "en") => {
  await page.goto(`${base}shop.html?lang=${lang}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".shop-product-visual img").evaluateAll(async (images) => {
    images.forEach((image) => {
      image.loading = "eager";
    });
    await Promise.all(images.map((image) => image.decode()));
  });
};
const cardCount = () => page.locator(".shop-product-card").count();
const cart = () => page.getByRole("button", { name: /^Cart: / });
const closeDialog = () =>
  page.getByRole("button", { name: "Close", exact: true }).click();
try {
  for (const lang of ["en", "ru"]) {
    await open(lang);
    for (const width of process.env.QA_INTERACTIONS_ONLY
      ? []
      : [390, 768, 1199, 1200, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.locator(".shop-footer").scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve)),
          ),
      );
      const geometry = await page.evaluate(() => {
        const container = document
          .querySelector("main > .aihub-container")
          .getBoundingClientRect();
        const cards = [...document.querySelectorAll(".shop-product-card")];
        return {
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          container: container.width,
          cardWidth: cards[0].getBoundingClientRect().width,
          columns: getComputedStyle(
            document.querySelector(".shop-products"),
          ).gridTemplateColumns.split(" ").length,
        };
      });
      report.geometry.push({ lang, ...geometry });
      check(
        `${lang}/${width}: no horizontal overflow`,
        geometry.scrollWidth <= width,
      );
      if (width >= 1200)
        check(
          `${lang}/${width}: fixed 1140px container and three columns`,
          Math.abs(geometry.container - 1140) < 1 && geometry.columns === 3,
        );
      await page.screenshot({
        path: `${output}/${lang}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open();
  check("Eight original products", (await cardCount()) === 8);
  const images = await page
    .locator(".shop-product-visual img")
    .evaluateAll(async (images) => {
      await Promise.all(images.map((image) => image.decode()));
      return images.every(
        (image) => image.naturalWidth === 640 && image.naturalHeight === 640,
      );
    });
  check("All eight generated icons load at 640x640", images);
  await page.getByRole("button", { name: "Automation", exact: true }).click();
  check("Category filters", (await cardCount()) === 2);
  await page
    .getByRole("searchbox", { name: "Search solutions" })
    .fill("  AUTO-FILL  ");
  await page.waitForFunction(
    () => document.querySelectorAll(".shop-product-card").length === 1,
  );
  check("Search trims whitespace and ignores case", (await cardCount()) === 1);
  await page.getByRole("searchbox").fill("not-a-real-solution");
  await page
    .getByRole("heading", { name: "No match. A fresh start?" })
    .waitFor();
  check("Empty search state", (await cardCount()) === 0);
  await page
    .getByRole("button", { name: "Reset filters", exact: true })
    .last()
    .click();
  await page.waitForFunction(
    () => document.querySelectorAll(".shop-product-card").length === 8,
  );
  check("Reset restores all products", (await cardCount()) === 8);

  await page
    .getByRole("button", {
      name: "Add to cart: AI Voice Assistant",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", {
      name: "Add to cart: AI Voice Assistant",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", {
      name: "Add to cart: AI Chat Assistant",
      exact: true,
    })
    .click();
  check(
    "Cart counter sums quantity",
    (await cart().getAttribute("aria-label")) === "Cart: 3",
  );
  await page.reload({ waitUntil: "networkidle" });
  check(
    "Cart survives page reload",
    (await cart().getAttribute("aria-label")) === "Cart: 3",
  );
  await cart().click();
  check(
    "Native modal opens",
    await page.locator("dialog").evaluate((dialog) => dialog.matches(":modal")),
  );
  check(
    "Correct mixed-product total",
    (await page.locator(".shop-total strong").innerText()) === "$3,970",
  );
  await page
    .getByRole("button", {
      name: "Decrease quantity: AI Voice Assistant",
      exact: true,
    })
    .click();
  check(
    "Decrease recalculates total",
    (await page.locator(".shop-total strong").innerText()) === "$2,480",
  );
  await page
    .getByRole("button", {
      name: "Increase quantity: AI Chat Assistant",
      exact: true,
    })
    .click();
  check(
    "Increase recalculates total",
    (await page.locator(".shop-total strong").innerText()) === "$3,470",
  );
  await page
    .getByRole("button", { name: "Remove: AI Chat Assistant", exact: true })
    .click();
  check(
    "Remove product",
    (await page.locator(".shop-cart-line").count()) === 1,
  );
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    check(
      `Modal keyboard trap ${i}`,
      await page.evaluate(() =>
        Boolean(document.activeElement.closest("dialog")),
      ),
    );
  }
  await page.screenshot({ path: `${output}/cart.png` });
  await page.keyboard.press("Escape");
  check(
    "Escape closes and restores focus",
    (await page.locator("dialog").count()) === 0 &&
      (await cart().evaluate((button) => document.activeElement === button)),
  );
  await cart().click();
  await page.mouse.click(10, 500);
  check("Backdrop closes cart", (await page.locator("dialog").count()) === 0);
  await cart().click();
  await page
    .getByRole("button", { name: "Continue to request", exact: false })
    .click();
  await page.waitForURL(/checkout\.html/);
  check("Cart navigates to a separate request page", page.url().startsWith(`${base}checkout.html`));
  check("Navigation does not clear unsubmitted cart", (await page.evaluate(() => JSON.parse(localStorage.getItem("aihub_cart"))))[0].qty === 1);
  await open();
  await page.evaluate(() => localStorage.removeItem("aihub_cart"));
  await page.reload({ waitUntil: "networkidle" });
  await cart().click();
  check(
    "Empty cart has no checkout action",
    (await page.getByRole("button", { name: /Continue to request/ }).count()) ===
      0,
  );
  await closeDialog();

  await page.evaluate(() => localStorage.setItem("aihub_cart", '{"bad":true}'));
  await page.reload({ waitUntil: "networkidle" });
  check(
    "Invalid stored cart handled",
    (await cart().getAttribute("aria-label")) === "Cart: 0",
  );
  await page.evaluate(() =>
    localStorage.setItem(
      "aihub_cart",
      JSON.stringify([
        { id: 1, qty: 100000 },
        { id: 1, qty: 2 },
        { id: 999, qty: 2 },
        { id: 2, qty: -4 },
        null,
      ]),
    ),
  );
  await page.reload({ waitUntil: "networkidle" });
  check(
    "Stored items validated, deduplicated and capped",
    (await cart().getAttribute("aria-label")) === "Cart: 99",
  );
  check(
    "Cannot add beyond quantity limit",
    await page
      .getByRole("button", {
        name: "Add to cart: AI Voice Assistant",
        exact: true,
      })
      .isDisabled(),
  );
  await page.evaluate(() => localStorage.removeItem("aihub_cart"));
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Switch to Russian" }).click();
  check(
    "Russian locale and shareable URL",
    (await page.locator("html").getAttribute("lang")) === "ru" &&
      new URL(page.url()).searchParams.get("lang") === "ru",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", {
      name: "В корзину: Голосовой AI-ассистент",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /^Корзина: / }).click();
  check(
    "Mobile cart contained in viewport",
    await page
      .locator("dialog")
      .evaluate(
        (el) =>
          el.getBoundingClientRect().width <= innerWidth &&
          el.scrollWidth <= el.clientWidth,
      ),
  );
  await page.screenshot({ path: `${output}/mobile-cart.png` });
  await page.keyboard.press("Escape");
  check(
    "Reduced motion disables hero float",
    await page
      .locator(".shop-hero-icon--main")
      .evaluate((el) => getComputedStyle(el).animationName === "none"),
  );

  await page.goto(`${base}design-system.html#icons`, {
    waitUntil: "networkidle",
  });
  check(
    "Design-system icon gallery has all eight",
    (await page.locator("#icons .aihub-solution-icon").count()) === 8,
  );
  await page.locator("#icons .ds-copy").first().click();
  check(
    "Icon JSX can be copied",
    (await page.evaluate(() => navigator.clipboard.readText())).includes(
      '<SolutionIcon name="voice-assistant"',
    ),
  );

  // The landing uses external legacy assets; only inspect its new navigation here.
  for (const width of [390, 768, 1199, 1200, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page
      .locator('.site-header a[href*="shop.html"]:visible')
      .first()
      .waitFor();
    const links = page.locator('.site-header a[href*="shop.html"]:visible');
    check(`Landing/${width}: shop link visible`, (await links.count()) === 1);
    await links.first().click();
    await page.waitForURL(/shop\.html/);
    check(
      `Landing/${width}: opens shop using BASE_URL`,
      page.url().startsWith(`${base}shop.html`),
    );
  }
  check("No JavaScript errors", report.errors.length === 0);
  check("No missing local assets", report.failedAssets.length === 0);
  check(
    "No order, payment or backend write requests",
    report.writes.length === 0,
  );
} finally {
  await writeFile(
    `${output}/report.json`,
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await browser.close();
}
