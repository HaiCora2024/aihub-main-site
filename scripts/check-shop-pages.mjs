// Checks that every catalog product has its product page, Vite input and
// package texts, so store cards cannot link to a missing or wrong page.
// Usage: node scripts/check-shop-pages.mjs
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function checkShopPages(root) {
  const errors = [];
  const read = (file) => readFile(path.join(root, file), "utf8");
  const catalog = JSON.parse(await read("backend/contact-api/shared/catalog.json"));
  const vite = await read("vite.config.ts");
  const pages = (await readdir(path.join(root, "shop"))).filter((f) => f.endsWith(".html"));
  const { productContent } = await import(
    pathToFileURL(path.join(root, "src/shop/product-content.ts")).href
  );
  const slugs = new Set(catalog.products.map((p) => p.slug));

  for (const product of catalog.products) {
    const file = `shop/${product.slug}.html`;
    if (!pages.includes(`${product.slug}.html`)) errors.push(`Missing page ${file}`);
    else {
      const meta = (await read(file)).match(
        /<meta\s+name="aihub-product"\s+content="([^"]*)"/,
      )?.[1];
      if (meta !== product.slug)
        errors.push(`${file}: aihub-product is "${meta}", expected "${product.slug}"`);
    }
    if (!vite.includes(`path.resolve(__dirname, "${file}")`))
      errors.push(`vite.config.ts: no build input for ${file}`);

    const packages = product.packages ?? [];
    if (!packages.length) errors.push(`${product.slug}: no packages`);
    const ids = packages.map((p) => p.id);
    if (new Set(ids).size !== ids.length) errors.push(`${product.slug}: duplicate package ids`);
    const top = Math.max(...packages.map((p) => p.priceMinor));
    if (packages.some((p) => p.openEnded && p.priceMinor !== top))
      errors.push(`${product.slug}: openEnded only allowed on the dearest package`);
    const texts = Object.keys(productContent[product.slug]?.packages ?? {});
    if ([...texts].sort().join() !== [...new Set(ids)].sort().join())
      errors.push(`src/shop/product-content.ts: ${product.slug} packages do not match catalog`);
  }
  for (const page of pages)
    if (!slugs.has(page.replace(/\.html$/, "")))
      errors.push(`shop/${page}: no catalog product with this slug`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const errors = await checkShopPages(fileURLToPath(new URL("../", import.meta.url)));
  for (const error of errors) console.error(error);
  if (errors.length) process.exit(1);
  console.log("Shop pages match the catalog.");
}
