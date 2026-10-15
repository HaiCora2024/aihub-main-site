// Run against a production preview. Playwright may be installed outside this repo.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.PREVIEW_URL || "http://localhost:4173/";
const output = process.env.QA_OUTPUT || "/tmp/aihub-design-qa";
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
await mkdir(output, { recursive: true });
const report = {
  geometry: [],
  interactions: [],
  consoleErrors: [],
  failedAssets: [],
  postRequests: [],
};
page.on("pageerror", (error) => report.consoleErrors.push(error.message));
page.on("response", (response) => {
  if (response.url().startsWith(base) && response.status() >= 400)
    report.failedAssets.push([response.status(), response.url()]);
});
page.on("request", (request) => {
  if (request.method() === "POST") report.postRequests.push(request.url());
});
const check = (name, condition) => {
  assert.ok(condition, name);
  report.interactions.push(name);
  console.log("PASS", name);
};
const open = async (query = "") => {
  await page.goto(`${base}design-system.html${query}`, {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
};
try {
  const widths = process.env.QA_INTERACTIONS_ONLY
    ? []
    : [390, 768, 1199, 1200, 1440, 1920];
  const ids = [
    "hero",
    "results",
    "clients",
    "services",
    "cases",
    "roadmap",
    "contact",
    "integrations",
    "work-process",
    "team",
    "demo",
    "footer",
  ];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "",
      "?preview=template&target=service&lang=ru",
      "?preview=template&target=case&lang=en",
      ...ids.map((id) => `?preview=block&target=${id}&lang=ru`),
    ]) {
      await open(route);
      const result = await page.evaluate(() => {
        const containers = [
          ...document.querySelectorAll(".aihub-container"),
        ].map(
          (node) => Math.round(node.getBoundingClientRect().width * 10) / 10,
        );
        const overflow = [
          ...document.querySelectorAll(
            "main h1, main h2, main h3, main p, main input, main .aihub-button, main .aihub-card",
          ),
        ]
          .filter((node) => {
            if (node.closest(".ds-mini, .ds-hero-specimen, .ds-glow-example"))
              return false;
            const box = node.getBoundingClientRect();
            return box.width && (box.left < -1 || box.right > innerWidth + 1);
          })
          .map((node) => `${node.tagName}.${node.className}`);
        return {
          viewport: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          containers,
          overflow,
        };
      });
      assert.equal(
        result.scrollWidth,
        width,
        `Horizontal overflow at ${width}: ${route}`,
      );
      assert.equal(
        result.overflow.length,
        0,
        `Clipped content at ${width}: ${route}: ${result.overflow}`,
      );
      if (width >= 1200)
        assert.ok(
          result.containers.every((value) => value === 1140),
          `Container width at ${width}: ${route}`,
        );
      report.geometry.push({ width, route: route || "catalog", ...result });
    }
    console.log(`PASS geometry ${width}px: catalog, 2 templates, 12 blocks`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open();
  check(
    "All 12 blocks represented",
    (await page.locator(".ds-atlas-card").count()) === 12,
  );
  check(
    "All 21 kit components indexed",
    (await page.locator(".ds-hero-stats strong").nth(1).textContent()) === "21",
  );
  check(
    "Geologica and Manrope loaded",
    await page.evaluate(() =>
      ["Geologica", "Manrope"].every((name) =>
        [...document.fonts].some(
          (font) => font.family === name && font.status === "loaded",
        ),
      ),
    ),
  );
  await page.screenshot({ path: `${output}/catalog-desktop.png` });
  await page
    .getByRole("navigation", { name: "Разделы дизайн-системы" })
    .getByRole("link", { name: "Цвет", exact: true })
    .click();
  await page.waitForTimeout(100);
  check(
    "Navigation tracks the active section",
    (await page
      .locator('.ds-nav a[aria-current="location"]')
      .getAttribute("href")) === "#colors",
  );
  await page.locator("#colors .ds-token .ds-copy").first().click();
  check(
    "CSS variable copies to clipboard",
    (await page.evaluate(() => navigator.clipboard.readText())) ===
      "var(--aihub-color-bg)",
  );
  for (const section of ["colors", "components", "atlas", "templates"]) {
    await page.locator(`#${section}`).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/catalog-${section}.png` });
  }
  await page.keyboard.press("Control+k");
  check(
    "Search keyboard shortcut",
    await page
      .locator("#ds-search")
      .evaluate((node) => node === document.activeElement),
  );
  await page.locator("#ds-search").fill("--aihub-color-green");
  check(
    "Token search reads computed value",
    (await page.locator("#ds-search-results").innerText())
      .toUpperCase()
      .includes("#08D070"),
  );
  await page.locator("#ds-search").fill("ProgressRing");
  await page
    .locator("#ds-search-results a")
    .filter({ hasText: "React-компонент" })
    .click();
  await page.waitForFunction(() =>
    document
      .querySelector('.ds-component-families button[aria-pressed="true"]')
      ?.textContent.includes("Показатели"),
  );
  check(
    "Component search selects the example",
    await page
      .locator('.ds-component-families button[aria-pressed="true"]')
      .textContent()
      .then((text) => text.includes("Показатели")),
  );
  await page.getByRole("tab", { name: "Код", exact: true }).click();
  const copiedCode = await page.locator("#playground-panel pre").innerText();
  await page.locator("#playground-panel .ds-copy").click();
  check(
    "JSX copying writes to clipboard",
    (await page.evaluate(() => navigator.clipboard.readText())) === copiedCode,
  );
  await page.getByRole("tab", { name: "Код", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  check(
    "Tab keyboard navigation",
    (await page
      .getByRole("tab", { name: "Правила", exact: true })
      .getAttribute("aria-selected")) === "true",
  );
  await page
    .locator(".ds-component-families button")
    .filter({ hasText: "Действия" })
    .click();
  const state = page.getByLabel("Состояние", { exact: true });
  await state.selectOption("disabled");
  check(
    "Disabled button cannot activate",
    await page.locator(".ds-stage .aihub-button").isDisabled(),
  );
  await state.selectOption("loading");
  check(
    "Loading has accessible busy state",
    (await page
      .locator(".ds-stage .aihub-button")
      .getAttribute("aria-busy")) === "true",
  );
  await state.selectOption("focus");
  check(
    "Focus has visible outline",
    await page
      .locator(".ds-stage .aihub-button")
      .evaluate((node) => getComputedStyle(node).outlineStyle !== "none"),
  );
  await state.selectOption("default");
  await page.locator(".ds-stage .aihub-button").click();
  check(
    "Local action is working",
    (await page.locator('.ds-stage [role="status"]').innerText()).includes(
      "Local action",
    ),
  );
  const centers = await page
    .locator(".ds-stage .aihub-cta-frame")
    .evaluate((node) => {
      const frame = node.getBoundingClientRect();
      const button = node.firstElementChild.getBoundingClientRect();
      return {
        x: (frame.left + frame.right - button.left - button.right) / 2,
        y: (frame.top + frame.bottom - button.top - button.bottom) / 2,
      };
    });
  check(
    "CTA frame centers both axes",
    Math.abs(centers.x) < 1 && Math.abs(centers.y) < 1,
  );
  await page.locator(".ds-language button").filter({ hasText: "RU" }).click();
  check(
    "RU example language switches",
    (await page.locator(".ds-stage .aihub-button").innerText()).includes(
      "Записаться",
    ),
  );
  await page.locator("#atlas").scrollIntoViewIfNeeded();
  await page
    .getByRole("link", { name: "Посмотреть Cases", exact: true })
    .click();
  check(
    "Atlas deep link selects Cases",
    (
      await page.locator("#atlas-preview .ds-inline-heading h3").innerText()
    ).startsWith("Cases"),
  );
  for (const width of [390, 768, 1200, 1440]) {
    await page
      .locator("#atlas-preview .ds-widths button")
      .filter({ hasText: String(width) })
      .click();
    const iframe = page.frameLocator("#atlas-preview iframe");
    await iframe.locator(".aihub-container").first().waitFor();
    check(
      `Isolated iframe viewport ${width}px`,
      (await iframe.locator("body").evaluate(() => innerWidth)) === width,
    );
    const rect = await page.locator("#atlas-preview iframe").boundingBox();
    check(
      `Iframe is centered at ${width}px`,
      rect.x >= 149 && rect.x + rect.width <= 1291,
    );
  }
  const iframeBefore = await page
    .locator("#atlas-preview iframe")
    .elementHandle();
  await page
    .getByRole("button", { name: "Повторить анимации cases", exact: true })
    .click();
  check(
    "Replay remounts iframe",
    !(await iframeBefore.evaluate((node) => node.isConnected)),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  await page.screenshot({ path: `${output}/catalog-mobile.png` });
  await page.locator("#components").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${output}/components-mobile.png` });
  await open("?preview=template&target=service&lang=en");
  await page.screenshot({ path: `${output}/service-mobile.png` });
  await page
    .getByRole("link", { name: "Book a consultation", exact: true })
    .click();
  check(
    "Template CTA navigates to contact",
    new URL(page.url()).hash === "#preview-contact",
  );
  const form = page.locator("form");
  await form
    .getByRole("button", { name: "Book a consultation", exact: true })
    .click();
  check(
    "Empty name and email show errors",
    (await form.locator('[aria-invalid="true"]').count()) === 2,
  );
  check(
    "Focus moves to first invalid input",
    await form
      .locator('[name="name"]')
      .evaluate((node) => node === document.activeElement),
  );
  await form.getByLabel("Your name").fill("QA Demo");
  await form.getByLabel("Your e-mail").fill("invalid@");
  await form
    .getByRole("button", { name: "Book a consultation", exact: true })
    .click();
  check(
    "Malformed email shows message",
    (await form.innerText()).includes("Please enter a valid e-mail address."),
  );
  await form.getByLabel("Your e-mail").fill("demo@example.com");
  check(
    "Phone is optional",
    (await form.locator('[name="phone"]').getAttribute("required")) === null,
  );
  await form
    .getByRole("button", { name: "Book a consultation", exact: true })
    .click();
  check(
    "Sending status visible",
    (await form.getByRole("button").getAttribute("aria-busy")) === "true",
  );
  await form
    .getByText("Demo complete. No data was sent.", { exact: true })
    .waitFor();
  check("Successful demo with empty phone", true);
  const phone = form.locator('[name="phone"]');
  await phone.hover();
  const hoverShadow = await phone.evaluate(
    (node) => getComputedStyle(node).boxShadow,
  );
  await phone.focus();
  const focusShadow = await phone.evaluate(
    (node) => getComputedStyle(node).boxShadow,
  );
  check(
    "Field focus increases inner glow",
    hoverShadow.includes("inset") &&
      focusShadow.includes("inset") &&
      hoverShadow !== focusShadow,
  );
  check(
    "No POST requests from catalog or templates",
    report.postRequests.length === 0,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open("?preview=template&target=case&lang=ru");
  await page.screenshot({ path: `${output}/case-desktop.png` });
  await open("?preview=block&target=cases&lang=en");
  check(
    "Reduced motion immediately shows final metrics",
    (await page.locator(".aihub-progress strong").first().innerText()) ===
      "85%",
  );
  check(
    "Reduced motion disables reveal transitions",
    (await page
      .locator(".aihub-reveal")
      .first()
      .evaluate((node) => getComputedStyle(node).transitionDuration)) === "0s",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open("?preview=block&target=cases&lang=en");
  const early = await page
    .locator(".aihub-progress strong")
    .first()
    .innerText();
  check("Metric waits for card reveal", early === "0%");
  await page.waitForTimeout(2400);
  check(
    "Metric finishes after reveal",
    (await page.locator(".aihub-progress strong").first().innerText()) ===
      "85%",
  );
  await page.screenshot({ path: `${output}/cases-desktop.png` });
  await open("#component-Button");
  await page.getByLabel("Состояние", { exact: true }).selectOption("hover");
  await page.waitForTimeout(400);
  check(
    "Unified hover scale and lift",
    await page.locator(".ds-stage .aihub-button").evaluate((node) => {
      const matrix = new DOMMatrix(getComputedStyle(node).transform);
      return (
        Math.abs(matrix.a - 1.035) < 0.001 && Math.abs(matrix.f + 2) < 0.01
      );
    }),
  );
  check(
    "320ms CTA transition",
    await page
      .locator(".ds-stage .aihub-button")
      .evaluate((node) =>
        getComputedStyle(node).transitionDuration.includes("0.32s"),
      ),
  );
  for (const tone of ["green", "blue", "yellow", "orange"]) {
    await page.getByLabel("Цвет", { exact: true }).selectOption(tone);
    check(
      `CTA glow inherits its own ${tone} accent`,
      await page.locator(".ds-stage .aihub-button").evaluate((node) => {
        const style = getComputedStyle(node);
        const accent = style.getPropertyValue("--aihub-accent").trim();
        return (
          style
            .getPropertyValue("--aihub-shadow-glow-hover")
            .includes(accent) &&
          style.getPropertyValue("--aihub-shadow-glow").includes(accent)
        );
      }),
    );
  }
  check("No runtime exceptions", report.consoleErrors.length === 0);
  check("No missing local assets", report.failedAssets.length === 0);
  console.log(
    `PASS ${report.geometry.length} geometry checks; ${report.interactions.length} interaction checks`,
  );
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
