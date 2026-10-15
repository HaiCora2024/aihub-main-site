#!/usr/bin/env node
/**
 * Pushes the shop catalog (src/shop/data.ts) to Ecwid and records the Ecwid
 * product IDs in src/shop/ecwid-products.json.
 *
 * Usage:
 *   npm run ecwid:sync -- --dry-run   # show what would be sent, change nothing
 *   npm run ecwid:sync                # create / update products in Ecwid
 *
 * Reads from the environment or a local, git-ignored .env.local:
 *   ECWID_STORE_ID       numeric store ID (or VITE_ECWID_STORE_ID)
 *   ECWID_SECRET_TOKEN   secret_… token of a custom app with
 *                        read_catalog + create_catalog + update_catalog scopes
 *   ECWID_TRANSLATIONS   "1" to also send Russian names/descriptions
 *                        (needs a multilingual store, Business plan)
 *
 * Products are matched by SKU = product slug, categories by English name,
 * so running the script again updates instead of duplicating.
 * NEVER put the secret token into a VITE_* variable or commit it.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer, loadEnv } from "vite";

const root = path.resolve(import.meta.dirname, "..");
const mapFile = path.join(root, "src/shop/ecwid-products.json");
const dryRun = process.argv.includes("--dry-run");

const env = { ...loadEnv("production", root, ""), ...process.env };
const storeId = String(env.ECWID_STORE_ID || env.VITE_ECWID_STORE_ID || "").trim();
const token = String(env.ECWID_SECRET_TOKEN || "").trim();
const withTranslations = env.ECWID_TRANSLATIONS === "1";

if (!dryRun) {
  if (!/^\d+$/.test(storeId)) fail("ECWID_STORE_ID is missing or not numeric.");
  if (!token.startsWith("secret_")) fail("ECWID_SECRET_TOKEN is missing (expected secret_…).");
}

/* Load data.ts through Vite so TypeScript and import.meta.env just work. */
const vite = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  configFile: false,
  optimizeDeps: { noDiscovery: true, entries: [] },
  server: { middlewareMode: true, hmr: false },
});
const { products, categories } = await vite.ssrLoadModule("/src/shop/data.ts");
await vite.close();

const api = `https://app.ecwid.com/api/v3/${storeId}`;

async function call(method, url, body) {
  const response = await fetch(`${api}${url}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${method} ${url} → HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : {};
}

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const unitLabel = { setup: { en: "One-time setup", ru: "Разовое внедрение" }, session: { en: "Per session", ru: "За сессию" } };
const describe = (product, lang) =>
  `<p>${escapeHtml(product.description[lang])}</p><p><em>${unitLabel[product.unit][lang]}</em></p>`;

function categoryPayload(category) {
  return {
    name: category.name.en,
    enabled: true,
    ...(withTranslations && { nameTranslated: { en: category.name.en, ru: category.name.ru } }),
  };
}

function productPayload(product, categoryId) {
  return {
    sku: product.slug,
    name: product.name.en,
    price: product.price,
    description: describe(product, "en"),
    enabled: true,
    isShippingRequired: false, // services: no delivery step at checkout
    unlimited: true,
    ...(categoryId && { categoryIds: [categoryId], defaultCategoryId: categoryId }),
    ...(withTranslations && {
      nameTranslated: { en: product.name.en, ru: product.name.ru },
      descriptionTranslated: { en: describe(product, "en"), ru: describe(product, "ru") },
    }),
  };
}

if (dryRun) {
  console.log(`Dry run — nothing is sent. Store: ${storeId || "(not set)"}\n`);
  for (const category of categories) console.log("category", JSON.stringify(categoryPayload(category)));
  for (const product of products) console.log("product ", JSON.stringify(productPayload(product, 0)));
  console.log(`\n${categories.length} categories, ${products.length} products.`);
  process.exit(0);
}

/* 1. Categories: find by English name or create. */
const existingCategories = (await call("GET", "/categories?limit=100")).items ?? [];
const categoryIds = {};
for (const category of categories) {
  const found = existingCategories.find((c) => c.name === category.name.en);
  if (found) {
    await call("PUT", `/categories/${found.id}`, categoryPayload(category));
    categoryIds[category.id] = found.id;
    console.log(`= category ${category.name.en} (#${found.id})`);
  } else {
    const { id } = await call("POST", "/categories", categoryPayload(category));
    categoryIds[category.id] = id;
    console.log(`+ category ${category.name.en} (#${id})`);
  }
}

/* 2. Products: find by SKU or create. */
const map = {};
for (const product of products) {
  const payload = productPayload(product, categoryIds[product.category]);
  const search = await call("GET", `/products?sku=${encodeURIComponent(product.slug)}`);
  const existing = (search.items ?? []).find((p) => p.sku === product.slug);
  if (existing) {
    await call("PUT", `/products/${existing.id}`, payload);
    map[product.slug] = existing.id;
    console.log(`= product  ${product.slug} (#${existing.id}) $${product.price}`);
  } else {
    const { id } = await call("POST", "/products", payload);
    map[product.slug] = id;
    console.log(`+ product  ${product.slug} (#${id}) $${product.price}`);
  }
}

await writeFile(mapFile, `${JSON.stringify(map, null, 2)}\n`);
console.log(`\nSaved ${Object.keys(map).length} Ecwid IDs to src/shop/ecwid-products.json — commit this file.`);

function fail(message) {
  console.error(`ecwid:sync: ${message}\nSee docs/shop.md → "Ecwid".`);
  process.exit(1);
}
