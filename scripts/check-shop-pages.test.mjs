import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { checkShopPages } from "./check-shop-pages.mjs";

const pkg = (id, priceMinor, openEnded = false) => ({
  id,
  priceMinor,
  openEnded,
  name: { en: id, ru: id },
});
const page = (slug) =>
  `<!doctype html><html><head><meta name="aihub-product" content="${slug}" /></head></html>\n`;

// Minimal copy of the files the checker reads; each test breaks one thing.
function fixture(t, change = () => {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "aihub-shop-pages-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const files = {
    catalog: {
      products: [
        { id: 1, slug: "a", packages: [pkg("start", 100), pkg("pro", 200, true)] },
        { id: 2, slug: "b", packages: [pkg("standard", 300)] },
      ],
    },
    vite: `input: {\n  productA: path.resolve(__dirname, "shop/a.html"),\n  productB: path.resolve(__dirname, "shop/b.html"),\n}`,
    pages: { "a.html": page("a"), "b.html": page("b") },
    content: { a: ["start", "pro"], b: ["standard"] },
  };
  change(files);
  const write = (file, text) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), text);
  };
  write("backend/contact-api/shared/catalog.json", JSON.stringify(files.catalog));
  write("vite.config.ts", files.vite);
  for (const [name, html] of Object.entries(files.pages)) write(`shop/${name}`, html);
  const content = Object.fromEntries(
    Object.entries(files.content).map(([slug, ids]) => [
      slug,
      { packages: Object.fromEntries(ids.map((id) => [id, []])) },
    ]),
  );
  write(
    "src/shop/product-content.ts",
    `export const productContent = ${JSON.stringify(content)};\n`,
  );
  return root;
}

test("a consistent catalog, pages and texts pass", async (t) => {
  assert.deepEqual(await checkShopPages(fixture(t)), []);
});

test("a product without its page fails", async (t) => {
  const root = fixture(t, (f) => delete f.pages["b.html"]);
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("shop/b.html")), errors.join("\n"));
});

test("a page that names another product fails", async (t) => {
  const root = fixture(t, (f) => (f.pages["b.html"] = page("a")));
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("aihub-product")), errors.join("\n"));
});

test("a page without a product fails", async (t) => {
  const root = fixture(t, (f) => (f.pages["old.html"] = page("old")));
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("old.html")), errors.join("\n"));
});

test("a page missing from the Vite inputs fails", async (t) => {
  const root = fixture(t, (f) => (f.vite = f.vite.replace(/.*shop\/b\.html.*\n/, "")));
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("vite.config.ts")), errors.join("\n"));
});

test("openEnded on a cheaper package fails", async (t) => {
  const root = fixture(t, (f) => {
    f.catalog.products[0].packages = [pkg("start", 100, true), pkg("pro", 200)];
  });
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("openEnded")), errors.join("\n"));
});

test("duplicate package ids fail", async (t) => {
  const root = fixture(t, (f) => {
    f.catalog.products[1].packages = [pkg("standard", 300), pkg("standard", 400)];
    f.content.b = ["standard"];
  });
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("duplicate")), errors.join("\n"));
});

test("package texts that do not match the catalog fail", async (t) => {
  const root = fixture(t, (f) => (f.content.a = ["start"]));
  const errors = await checkShopPages(root);
  assert.ok(errors.some((e) => e.includes("product-content")), errors.join("\n"));
});
