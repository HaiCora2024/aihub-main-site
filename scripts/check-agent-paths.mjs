import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--dist")) {
  console.error("Usage: node scripts/check-agent-paths.mjs [--dist dist]");
  process.exit(2);
}
const dist = args.length ? path.resolve(root, args[1]) : null;
let checks = 0;
const failures = [];
const warnings = [];
const check = (condition, message) => {
  checks += 1;
  if (!condition) failures.push(message);
};
const exists = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};
const read = (file) => readFile(path.resolve(root, file), "utf8");
const walk = async (dir) => {
  const files = [];
  for (const entry of await readdir(path.resolve(root, dir), { withFileTypes: true })) {
    const file = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(file));
    else if (entry.isFile()) files.push(file);
  }
  return files;
};

const required = [
  "AGENTS.md", "CLAUDE.md", "_AI_RULES.md", "README.md",
  "docs/agent-page-guide.md", "docs/shop-backend-guide.md",
  "docs/agent-paths-audit.md", "backend/contact-api/README.md",
];
for (const file of required) check(await exists(path.join(root, file)), `Missing entry: ${file}`);

// Check actual Markdown links, not future file names inside example code fences.
const documents = new Set([
  ...required,
  ...(await walk("docs")).filter((file) => file.endsWith(".md")),
]);
for (const file of documents) {
  if (!await exists(path.join(root, file))) continue;
  const source = (await read(file)).replace(/```[^\n]*\n[\s\S]*?```/g, "");
  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
    const pathname = decodeURIComponent(href.split(/[?#]/)[0]);
    const target = path.resolve(root, path.dirname(file), pathname);
    const relative = path.relative(root, target);
    const inside = relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    check(inside && await exists(target), `${file}: invalid local link ${href}`);
  }
}

const config = await read("vite.config.ts");
const entries = [...config.matchAll(/path\.resolve\(__dirname,\s*["']([^"']+\.html)["']\)/g)]
  .map((match) => match[1]);
check(entries.length > 0, "No HTML inputs found in vite.config.ts; update the checker if config changes");
for (const file of entries) {
  const present = await exists(path.join(root, file));
  check(present, `Missing Vite input: ${file}`);
  if (!present) continue;
  const source = await read(file);
  const scripts = [...source.matchAll(/<script\b[^>]*type=["']module["'][^>]*src=["']([^"']+)["']/g)];
  check(scripts.length > 0, `${file}: no module entry found`);
  for (const [, src] of scripts) {
    const target = src.startsWith("/") ? path.join(root, src.slice(1)) : path.resolve(root, path.dirname(file), src);
    check(await exists(target), `${file}: missing module ${src}`);
  }
  if (dist) check(await exists(path.join(dist, file)), `Build missing ${file}`);
}

const metadata = [
  "public/llms.txt", "public/robots.txt", "public/sitemap.xml",
  "public/.well-known/agent.json", "public/.well-known/agents.json",
  "public/.well-known/webmcp.json",
];
const json = new Map();
const urls = new Set();
for (const file of metadata) {
  const source = await read(file);
  if (file.endsWith(".json")) {
    try {
      json.set(file, JSON.parse(source));
      check(true, "JSON valid");
    } catch {
      check(false, `${file}: invalid JSON`);
    }
  }
  for (const [url] of source.matchAll(/https?:\/\/[^\s<>"'`)]+/g)) urls.add(url);
  if (dist) {
    const output = path.join(dist, file.slice("public/".length));
    const present = await exists(output);
    check(present, `Build missing public metadata: ${file}`);
    if (present) check(await readFile(output, "utf8") === source, `Build has stale metadata: ${file}`);
  }
}

const anchors = new Set([...((await read("src/App.tsx")).matchAll(/id:\s*"([^"]+)"/g))]
  .map((match) => match[1]));
const external = [];
for (const raw of urls) {
  const url = new URL(raw);
  // Canonical discovery URLs intentionally refer to the primary domain on both hosts.
  if (url.origin !== "https://aihub.works") {
    external.push(raw);
    continue;
  }
  const route = decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
  check(entries.includes(route) || await exists(path.join(root, "public", route)), `Unknown public route: ${raw}`);
  if (url.hash && route === "index.html") {
    check(anchors.has(decodeURIComponent(url.hash.slice(1))), `Unknown landing anchor: ${raw}`);
  }
}

const agents = json.get("public/.well-known/agents.json")?.agents ?? [];
const tools = json.get("public/.well-known/webmcp.json")?.tools ?? [];
const contactBase = (await read(".github/workflows/gh-pages.yml"))
  .match(/VITE_CONTACT_API_URL:\s*(https:\/\/\S+)/)?.[1];
check(Boolean(contactBase), "Missing contact API origin in workflow; update the checker if moved to variables");
const contact = agents.find((agent) => agent.methods?.includes("POST"));
check(contact?.url === `${contactBase}/api/contact`, "Consultation manifest and frontend API origins differ");
check(["name", "email"].every((key) => contact?.inputSchema?.required?.includes(key)), "Contact schema must require name and email");
check(tools.find((tool) => tool.name === "book-consultation")?.url === contact?.url, "Discovery contact URLs differ");
if (agents.some((agent) => agent.protocol === "a2a")) {
  warnings.push("Legacy manifest declares a2a for chat; HTTP reachability does not verify A2A interoperability.");
}
if (json.get("public/.well-known/webmcp.json")?.spec) {
  warnings.push("webmcp.json is legacy metadata, not a verified browser WebMCP implementation.");
}

for (const failure of failures) console.error(`FAIL ${failure}`);
for (const warning of warnings) console.warn(`WARN ${warning}`);
console.log(`${checks - failures.length}/${checks} local path checks passed; ${documents.size} documents, ${entries.length} HTML inputs.`);
console.log(`External URLs not requested (${external.length}): ${external.join(", ")}`);
console.log("No HTTP requests or writes performed. See docs/agent-paths-audit.md for live checks and limitations.");
if (failures.length) process.exitCode = 1;
