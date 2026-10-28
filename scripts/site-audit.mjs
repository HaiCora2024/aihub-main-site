import fs from "node:fs/promises";
import path from "node:path";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = new URL(process.env.QA_URL || "https://aihub.works/");
const output = process.env.QA_OUTPUT || "tmp/site-audit";
const config = await fs.readFile(new URL("../vite.config.ts", import.meta.url), "utf8");
const routes = [...config.matchAll(/path\.resolve\(__dirname, "([^"]+\.html)"\)/g)]
  .map((match) => match[1] === "index.html" ? "" : match[1]);
const widths = [320, 390, 768, 1199, 1200, 1440, 1920];
const bilingualCases = new Set([
  "cases/hotel-concierge.html", "cases/order-processing-1c.html", "cases/rental-platform.html",
]);
const report = {
  base: base.href, started: new Date().toISOString(),
  pages: [], checks: [], failures: [], runtimeErrors: [], failedAssets: [],
  externalLinks: [], blockedWrites: [], languages: ["en", "ru"],
  polish: "No PL page localization is implemented; Polish company names are preserved as source text.",
};
const documents = new Map();
const links = new Map();
const check = (name, ok, detail) => {
  report.checks.push({ name, ok, ...(detail ? { detail } : {}) });
  if (!ok) report.failures.push({ name, detail });
};
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
const context = await browser.newContext({ reducedMotion: "reduce" });
// No production form, chat or mail writes are permitted during this audit.
await context.route("**/*", (route) => {
  const request = route.request();
  if (["GET", "HEAD", "OPTIONS"].includes(request.method())) return route.continue();
  if (new URL(request.url()).hostname === "challenges.cloudflare.com") return route.continue();
  report.blockedWrites.push({ path: new URL(request.url()).pathname });
  return route.abort();
});
await fs.mkdir(output, { recursive: true });
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.on("pageerror", (error) => report.runtimeErrors.push({ url: page.url(), error: error.message }));
page.on("response", (response) => {
  if (response.status() >= 400 && !response.url().includes("challenges.cloudflare.com"))
    report.failedAssets.push({ url: response.url(), status: response.status() });
});
const settle = () => page.evaluate(() => new Promise((resolve) =>
  requestAnimationFrame(() => requestAnimationFrame(resolve))));
const documentKey = (url) => {
  const pathname = url.pathname.replace(/index\.html$/, "");
  return `${pathname}?lang=${url.searchParams.get("lang") === "ru" ? "ru" : "en"}`;
};

try {
  for (const route of routes) {
    for (const lang of ["en", "ru"]) {
      const url = new URL(route, base);
      url.searchParams.set("lang", lang);
      const label = `${route || "/"}/${lang}`;
      try {
        await page.setViewportSize({ width: 1440, height: 1000 });
        const response = await page.goto(url.href, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.locator("h1").first().waitFor({ state: "attached" });
        await page.evaluate(() => Promise.race([
          document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 3000)),
        ]));
        const data = await page.evaluate(() => ({
          title: document.title, lang: document.documentElement.lang,
          ids: [...document.querySelectorAll("[id]")].map((el) => el.id),
          links: [...document.querySelectorAll("a[href]")].map((el) => ({
            href: el.href, label: (el.getAttribute("aria-label") || el.textContent || "").trim(),
          })),
        }));
        documents.set(documentKey(url), data);
        report.pages.push({ route, lang, status: response.status(), title: data.title, actualLanguage: data.lang });
        check(`${label}: HTTP 200`, response.status() === 200);
        if (route !== "design-system.html") {
          const expected = route.startsWith("cases/") && !bilingualCases.has(route) ? "en" : lang;
          check(`${label}: supported language`, data.lang === expected, data.lang);
        }
        for (const link of data.links) {
          const target = new URL(link.href);
          const id = `${documentKey(url)} -> ${target.href}`;
          links.set(id, { source: url.href, ...link });
          if (target.origin === base.origin && target.pathname !== url.pathname &&
            target.pathname !== new URL("design-system.html", base).pathname &&
            /(?:\/|\.html)$/.test(target.pathname) && data.lang === "ru" && route !== "design-system.html")
            check(`${label}: link preserves RU (${target.pathname}${target.hash})`,
              target.searchParams.get("lang") === "ru", link.href);
        }
        for (const width of widths) {
          await page.setViewportSize({ width, height: 1000 });
          if (route === "") {
            const cta = page.locator(width >= 1200
              ? ".site-header__cta" : "#hero .cta-btn-responsive");
            check(`${label}/${width}: hero consultation CTA is available`, await cta.isVisible());
          }
          for (const position of [0, 0.5, 1]) {
            await page.evaluate((position) => scrollTo({
              top: (document.documentElement.scrollHeight - innerHeight) * position,
              behavior: "instant",
            }), position);
            await settle();
            const geometry = await page.evaluate(() => ({
              width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
              bodyWidth: document.body.scrollWidth,
            }));
            check(`${label}/${width}/${position}: no horizontal scroll`,
              geometry.scrollWidth <= width + 1 && geometry.bodyWidth <= width + 1, geometry);
          }
          if (width < 768 && await page.locator(".site-header").count()) {
            check(`${label}/${width}: docked mobile menu stays collapsed`,
              await page.locator(".site-header__navigation").isHidden());
          }
          if ([390, 1440].includes(width) &&
            ["", "shop.html", "shop/voice-assistant.html", "checkout.html", "legal/privacy-policy.html"].includes(route)) {
            await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
            await settle();
            await page.screenshot({ path: path.join(output, `${(route || "landing").replaceAll("/", "-")}-${lang}-${width}.png`) });
          }
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
        if (route !== "design-system.html") {
          const opposite = data.lang === "ru" ? "en" : "ru";
          const toggle = await page.locator(".site-header__language").count()
            ? page.locator(".site-header__language")
            : page.locator("nav button").filter({ hasText: new RegExp(`^${opposite}$`, "i") }).first();
          if (await toggle.count()) {
            await toggle.click();
            await page.waitForFunction((value) => document.documentElement.lang === value, opposite);
            check(`${label}: switch writes URL`, new URL(page.url()).searchParams.get("lang") === opposite);
            await page.reload({ waitUntil: "domcontentloaded" });
            await page.locator("h1").first().waitFor({ state: "attached" });
            await settle();
            check(`${label}: switched language survives reload`,
              (await page.locator("html").getAttribute("lang")) === opposite);
          }
        }
        console.log("AUDITED", label);
      } catch (error) {
        check(`${label}: audit completed`, false, error.message);
        console.log("FAILED", label, error.message.split("\n")[0]);
      }
    }
  }

  for (const link of links.values()) {
    const target = new URL(link.href);
    if (["mailto:", "tel:"].includes(target.protocol)) {
      check(`Contact link: ${link.href}`, target.protocol === "mailto:"
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(decodeURIComponent(target.pathname))
        : /^\+?[\d ()-]+$/.test(decodeURIComponent(target.pathname)));
      continue;
    }
    if (target.origin !== base.origin) continue;
    const document = documents.get(documentKey(target));
    if (document) {
      if (target.hash) {
        let exists = document.ids.includes(decodeURIComponent(target.hash.slice(1)));
        if (!exists && target.pathname === new URL("design-system.html", base).pathname &&
          /^(#component-|#block-)/.test(target.hash)) {
          await page.goto(target.href, { waitUntil: "domcontentloaded" });
          const selector = target.hash.startsWith("#block-")
            ? `.ds-atlas-card[data-selected="true"] a[href="${target.hash}"]`
            : `.ds-component-names a[href="${target.hash}"]`;
          await page.locator(selector).waitFor({ state: "attached" });
          exists = true;
        }
        check(`Anchor: ${link.source} -> ${target.hash}`, exists);
      }
    } else {
      const response = await fetch(target, { method: "HEAD", signal: AbortSignal.timeout(15000) });
      check(`Internal URL: ${target.href}`, response.ok, response.status);
    }
  }
  if (process.env.QA_EXTERNAL !== "false") {
    const external = [...new Set([...links.values()].map((link) => link.href))]
      .map((href) => new URL(href))
      .filter((url) => /^https?:$/.test(url.protocol) && url.origin !== base.origin);
    for (const url of external) {
      try {
        let response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) });
        if (response.status === 405)
          response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        const result = { url: url.href, status: response.status,
          result: [401, 403, 429, 999].includes(response.status) ? "blocked, not verified" : response.ok ? "reachable" : "failed" };
        report.externalLinks.push(result);
        if (result.result === "failed") check(`External URL: ${url.href}`, false, response.status);
      } catch (error) {
        report.externalLinks.push({ url: url.href, result: "not verified", error: error.message });
      }
    }
  }
  check("No runtime errors", report.runtimeErrors.length === 0, report.runtimeErrors);
  const missingLocal = report.failedAssets.filter((asset) => new URL(asset.url).origin === base.origin);
  check("No missing local assets", missingLocal.length === 0, missingLocal);
} finally {
  report.finished = new Date().toISOString();
  await fs.writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify({ pages: report.pages.length, checks: report.checks.length,
    failures: report.failures.length, report: path.join(output, "report.json") }));
  if (report.failures.length) process.exitCode = 1;
}
