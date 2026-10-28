import http from "node:http";
import fs from "node:fs";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { google } from "googleapis";
import nodemailer from "nodemailer";
import { createShopService } from "./shop/service.js";
import {
  createFormSecurity,
  formSecurityFromEnv,
  FormError,
} from "./forms/security.js";
import { ContactReceipts } from "./forms/receipts.js";
import { createContactService } from "./forms/contact.js";

const PORT = Number(process.env.PORT || 8080);
const CONTACT_TO = process.env.CONTACT_TO || "aihubworks@gmail.com";
const CONTACT_FROM =
  process.env.CONTACT_FROM ||
  process.env.SMTP_USER ||
  "AIHUB Website <no-reply@aihub.works>";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const RATE_LIMIT_WINDOW_MS = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const MAX_BODY_BYTES = 20 * 1024;
const GOOGLE_SHEETS_SPREADSHEET_ID =
  process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const GOOGLE_SHEETS_RANGE = process.env.GOOGLE_SHEETS_RANGE || "Лист1!A:I";
const GOOGLE_SHEETS_DEFAULT_STATUS =
  process.env.GOOGLE_SHEETS_DEFAULT_STATUS || "Новый";
const GOOGLE_SHEETS_DEFAULT_PRIORITY =
  process.env.GOOGLE_SHEETS_DEFAULT_PRIORITY || "";

let sheetsClientPromise;

function getCorsOrigin(origin) {
  if (!origin) {
    return "*";
  }

  if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
    return origin;
  }

  return "";
}

function sendJson(res, statusCode, payload, corsOrigin = "*") {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": corsOrigin || "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET, HEAD",
    "Access-Control-Allow-Headers":
      "Content-Type, Idempotency-Key, X-Turnstile-Token",
    "Access-Control-Expose-Headers": "Retry-After",
    Vary: "Origin",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || ""))
    throw new FormError(415, "UNSUPPORTED_MEDIA_TYPE");
  return new Promise((resolve, reject) => {
    let raw = "";
    let bytes = 0;

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        raw = "";
        reject(new Error("BODY_TOO_LARGE"));
        return;
      }
      raw += chunk;
    });

    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });

    req.on("error", reject);
  });
}

function validateLead(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    return { ok: false, error: "INVALID_REQUEST" };
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const source =
    typeof body.source === "string"
      ? body.source.trim().slice(0, 120)
      : "aihub-site";
  const page =
    typeof body.page === "string" ? body.page.trim().slice(0, 500) : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return { ok: true, spam: true };
  }

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "INVALID_NAME" };
  }

  if (!email || email.length > 160) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "INVALID_EMAIL" };
  }

  if (phone && (phone.length < 5 || phone.length > 60)) {
    return { ok: false, error: "INVALID_PHONE" };
  }

  return { ok: true, lead: { name, email, phone, source, page } };
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE ?? "true").toLowerCase() === "true",
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getGoogleCredentials() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64) {
    const decoded = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64,
      "base64",
    ).toString("utf8");
    return JSON.parse(decoded);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
    return JSON.parse(
      fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"),
    );
  }

  return null;
}

async function getSheetsClient() {
  if (!sheetsClientPromise) {
    const credentials = getGoogleCredentials();

    if (!credentials) {
      throw new Error("GOOGLE_SHEETS_NOT_CONFIGURED");
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    sheetsClientPromise = google.sheets({ version: "v4", auth });
  }

  return sheetsClientPromise;
}

function formatDateForSheet(date = new Date()) {
  const formatted = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  // Force plain-text storage so Sheets does not reformat the timestamp column.
  return `'${formatted}`;
}

function formatContactsForSheet(lead) {
  const parts = [];

  if (lead.phone) {
    parts.push(`Phone: ${lead.phone}`);
  }

  if (lead.email) {
    parts.push(`E-mail: ${lead.email}`);
  }

  return parts.join(" | ");
}

async function appendLeadToSheet(lead) {
  if (!GOOGLE_SHEETS_SPREADSHEET_ID) {
    return;
  }

  const sheets = await getSheetsClient();
  const submittedAt = formatDateForSheet();
  const values = [
    lead.name,
    "",
    formatContactsForSheet(lead),
    "",
    "Лид-форма",
    "Новый",
    "",
    "",
    submittedAt,
  ];

  return sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
    range: GOOGLE_SHEETS_RANGE,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}

async function sendLeadEmail(lead) {
  const transporter = createTransporter();
  const submittedAt = new Date().toISOString();
  const subject = `AIHUB lead: ${lead.name}`;
  const text = [
    "New lead from AIHUB landing",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || "-"}`,
    `Source: ${lead.source}`,
    `Page: ${lead.page || "-"}`,
    `Submitted at: ${submittedAt}`,
  ].join("\n");
  const html = `
    <h2>New lead from AIHUB landing</h2>
    <p><b>Name:</b> ${escapeHtml(lead.name)}</p>
    <p><b>Email:</b> ${escapeHtml(lead.email)}</p>
    <p><b>Phone:</b> ${escapeHtml(lead.phone || "-")}</p>
    <p><b>Source:</b> ${escapeHtml(lead.source)}</p>
    <p><b>Page:</b> ${escapeHtml(lead.page || "-")}</p>
    <p><b>Submitted at:</b> ${escapeHtml(submittedAt)}</p>
  `;

  return transporter.sendMail({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    subject,
    text,
    html,
    replyTo: lead.email,
  });
}

async function handleContact(req, res, corsOrigin, contact) {
  if (!corsOrigin) {
    contact.reject("ORIGIN_NOT_ALLOWED");
    sendJson(res, 403, { ok: false, error: "ORIGIN_NOT_ALLOWED" }, "null");
    return;
  }

  try {
    contact.rate(req);
    const body = await readJsonBody(req);
    const validation = validateLead(body);

    if (!validation.ok) {
      contact.reject(validation.error);
      sendJson(res, 400, { ok: false, error: validation.error }, corsOrigin);
      return;
    }

    if (validation.spam) {
      contact.reject("HONEYPOT");
      sendJson(res, 200, { ok: true }, corsOrigin);
      return;
    }

    sendJson(res, 200, await contact.submit(req, validation.lead), corsOrigin);
  } catch (error) {
    if (error instanceof FormError) {
      if (error.retryAfter)
        res.setHeader("Retry-After", String(error.retryAfter));
      contact.reject(error.code);
      sendJson(res, error.status, { ok: false, error: error.code }, corsOrigin);
      return;
    }
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    contact.reject(
      ["BODY_TOO_LARGE", "INVALID_JSON"].includes(message)
        ? message
        : "CONTACT_UNAVAILABLE",
    );

    if (message === "BODY_TOO_LARGE") {
      sendJson(res, 413, { ok: false, error: message }, corsOrigin);
      return;
    }

    if (message === "INVALID_JSON") {
      sendJson(res, 400, { ok: false, error: message }, corsOrigin);
      return;
    }

    sendJson(res, 503, { ok: false, error: "CONTACT_UNAVAILABLE" }, corsOrigin);
  }
}

export function createServer({
  shopService = null,
  contactEmail,
  contactSheet,
  formSecurity = createFormSecurity({ rateWindowMs: RATE_LIMIT_WINDOW_MS }),
  contactReceipts,
  contactLog,
  contactLimit = RATE_LIMIT_MAX,
} = {}) {
  const receipts = contactReceipts || new ContactReceipts();
  const contact = createContactService({
    security: formSecurity,
    receipts,
    sendEmail: contactEmail || sendLeadEmail,
    appendSheet: contactSheet || appendLeadToSheet,
    limit: contactLimit,
    log: contactLog,
  });
  const server = http.createServer(async (req, res) => {
    const origin =
      typeof req.headers.origin === "string" ? req.headers.origin : "";
    const corsOrigin = getCorsOrigin(origin);
    let url;
    try {
      url = new URL(req.url || "/", "http://localhost");
    } catch {
      sendJson(res, 400, { error: { code: "INVALID_REQUEST" } }, corsOrigin);
      return;
    }

    if (url.pathname.startsWith("/api/shop/")) {
      if (shopService) await shopService.handle(req, res, url.pathname);
      else
        sendJson(res, 503, { error: { code: "SHOP_UNAVAILABLE" } }, corsOrigin);
      return;
    }
    if (
      (req.method === "GET" || req.method === "HEAD") &&
      url.pathname === "/health/ready"
    ) {
      sendJson(
        res,
        shopService?.ready() && contact.ready() ? 200 : 503,
        { ready: !!shopService?.ready() && contact.ready() },
        corsOrigin,
      );
      return;
    }

    if (req.method === "OPTIONS") {
      sendJson(res, 204, {}, corsOrigin || "null");
      return;
    }

    if (
      (req.method === "GET" || req.method === "HEAD") &&
      url.pathname === "/health"
    ) {
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": corsOrigin || "*",
        "Cache-Control": "no-store",
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/contact") {
      await handleContact(req, res, corsOrigin, contact);
      return;
    }

    sendJson(res, 404, { ok: false, error: "NOT_FOUND" }, corsOrigin || "*");
  });
  server.requestTimeout = 15000;
  server.headersTimeout = 10000;
  let formShutdown;
  server.stopForms = () => {
    formShutdown ||= contact.close().finally(() => {
      if (!contactReceipts) receipts.close();
    });
    return formShutdown;
  };
  server.once("close", () => void server.stopForms());
  return server;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const formSecurity = formSecurityFromEnv();
  const contactReceipts = new ContactReceipts(
    process.env.CONTACT_RECEIPTS_PATH ||
      (process.env.NODE_ENV === "production"
        ? "/data/forms/contact-receipts.sqlite"
        : ".local/contact-receipts.sqlite"),
    { secret: process.env.CONTACT_DEDUPE_KEY },
  );
  let shopService;
  if (process.env.SHOP_ENABLED === "true") {
    try {
      const transport = createTransporter();
      if (!ALLOWED_ORIGINS.length) throw new Error("ORIGINS_REQUIRED");
      if (
        Buffer.from(process.env.SHOP_BACKUP_KEY || "", "base64").length !== 32
      )
        throw new Error("BACKUP_KEY_REQUIRED");
      shopService = createShopService({
        filename: process.env.SHOP_DB_PATH || "/data/shop/shop.sqlite",
        origins: ALLOWED_ORIGINS,
        sendMail: (mail) => transport.sendMail(mail),
        from: CONTACT_FROM,
        salesTo: process.env.SHOP_SALES_TO,
        siteUrl: process.env.SHOP_SITE_URL || "https://aihub.works/",
        formSecurity,
        backupKey: process.env.SHOP_BACKUP_KEY,
        backupDirectory: process.env.SHOP_BACKUP_DIR,
      });
      shopService.start();
    } catch {
      await shopService?.stop();
      shopService = null;
      console.error("shop_initialization_failed; shop endpoints disabled");
    }
  }
  const server = createServer({ shopService, formSecurity, contactReceipts });
  server.listen(PORT, "0.0.0.0", () =>
    console.log(`contact-api listening on 0.0.0.0:${PORT}`),
  );
  const shutdown = () =>
    server.close(async () => {
      await server.stopForms();
      contactReceipts.close();
      await shopService?.stop();
      process.exit(0);
    });
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}
