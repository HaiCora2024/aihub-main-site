import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Image processing only; the original generated image is never overwritten.
const source = process.argv[2];
const transparent = process.argv.includes("--transparent");
if (!source)
  throw new Error(
    "Usage: SHARP_MODULE=/absolute/path/to/sharp-entry.js node scripts/prepare-shop-icons.mjs source.png",
  );
const { default: sharp } = await import(
  process.env.SHARP_MODULE
    ? pathToFileURL(process.env.SHARP_MODULE).href
    : "sharp"
);
const slugs = [
  "voice-assistant",
  "chat-assistant",
  "email-orders",
  "document-autofill",
  "kpi-reporting",
  "sentiment-monitor",
  "recommendations",
  "discovery-workshop",
];
const original = await readFile(source);
const { width, height } = await sharp(original).metadata();
if (!width || !height) throw new Error("Cannot read source dimensions");
const output = path.resolve("public/shop/icons");
await mkdir(output, { recursive: true });
const cellWidth = width / 4;
const cellHeight = height / 2;
const size = Math.floor(Math.min(cellWidth, cellHeight) - 64);
const files = [];
for (const [index, slug] of slugs.entries()) {
  const file = path.join(output, `${slug}.webp`);
  const bytes = await sharp(original)
    .extract({
      left: Math.round((index % 4) * cellWidth + (cellWidth - size) / 2),
      top: Math.round(
        Math.floor(index / 4) * cellHeight + (cellHeight - size) / 2,
      ),
      width: size,
      height: size,
    })
    .resize(640, 640)
    .webp({ quality: 88, effort: 6 })
    .toBuffer();
  await writeFile(file, bytes, { flag: "wx" });
  files.push({
    file: `public/shop/icons/${slug}.webp`,
    width: 640,
    height: 640,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
const metadata = {
  model: "gemini-nano-banana-2.1",
  imageId: "5bb4153c-fc0c-4bf7-85f6-b9ae603dbe7b",
  ...(transparent
    ? {
        backgroundRemoval: {
          model: "fal-bria-rmbg",
          imageId: "51be7937-fd0e-4911-b366-79d965f7f064",
          inputSha256:
            "975b53c70217965e83efae6939179fb0879e1fae8d496edb5598f980169b5b44",
        },
      }
    : {}),
  source: {
    width,
    height,
    sha256: createHash("sha256").update(original).digest("hex"),
  },
  processing:
    "4x2 equal cells, centered square crop with 32px edge inset, 640px WebP quality 88",
  files,
};
await mkdir("docs/assets", { recursive: true });
await sharp(original)
  .resize({ width: 1600 })
  .webp({ quality: 85 })
  .toFile(
    `docs/assets/shop-icons-sheet${transparent ? "-transparent" : ""}.webp`,
  );
await writeFile(
  "docs/shop-icons-manifest.json",
  `${JSON.stringify(metadata, null, 2)}\n`,
  { flag: "wx" },
);
console.log(JSON.stringify(metadata, null, 2));
