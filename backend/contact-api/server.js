import http from "node:http";
import fs from "node:fs";
import process from "node:process";

import { google } from "googleapis";
import nodemailer from "nodemailer";

const PORT = Number(process.env.PORT || 8080);
const CONTACT_TO = process.env.CONTACT_TO || "aihubworks@gmail.com";
const CONTACT_FROM = process.env.CONTACT_FROM || process.env.SMTP_USER || "AIHUB Website <no-reply@aihub.works>";
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const MAX_BODY_BYTES = 20 * 1024;
const GOOGLE_SHEETS_SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const GOOGLE_SHEETS_RANGE = process.env.GOOGLE_SHEETS_RANGE || "Лист1!A:J";
const GOOGLE_SHEETS_DEFAULT_STATUS = process.env.GOOGLE_SHEETS_DEFAULT_STATUS || "Новый";
const GOOGLE_SHEETS_DEFAULT_PRIORITY = process.env.GOOGLE_SHEETS_DEFAULT_PRIORITY || "";

const rateLimitStore = new Map();
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
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let bytes = 0;

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error("BODY_TOO_LARGE"));
        req.destroy();
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

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_MAX;
}

function getClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "unknown";
}

function validateLead(body) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const source = typeof body.source === "string" ? body.source.trim().slice(0, 120) : "aihub-site";
  const page = typeof body.page === "string" ? body.page.trim().slice(0, 500) : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) {
    return { ok: true, spam: true };
  }

  if (name.length < 2 || name.length > 120) {
    return { ok: false, error: "INVALID_NAME" };
  }

  if (phone.length < 5 || phone.length > 60) {
    return { ok: false, error: "INVALID_PHONE" };
  }

  return { ok: true, lead: { name, phone, source, page } };
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
    const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64, "base64").toString("utf8");
    return JSON.parse(decoded);
  }

  if (process.env.GOOGLE_SERVICE_ACCOUNT_FILE) {
    return JSON.parse(fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_FILE, "utf8"));
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
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
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
    lead.phone,
    "",
    lead.source || "Лид-форма",
    GOOGLE_SHEETS_DEFAULT_STATUS,
    GOOGLE_SHEETS_DEFAULT_PRIORITY,
    "",
    submittedAt,
    lead.page ? `Страница: ${lead.page}` : "",
  ];

  await sheets.spreadsheets.values.append({
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
    `Phone: ${lead.phone}`,
    `Source: ${lead.source}`,
    `Page: ${lead.page || "-"}`,
    `Submitted at: ${submittedAt}`,
  ].join("\n");
  const html = `
    <h2>New lead from AIHUB landing</h2>
    <p><b>Name:</b> ${escapeHtml(lead.name)}</p>
    <p><b>Phone:</b> ${escapeHtml(lead.phone)}</p>
    <p><b>Source:</b> ${escapeHtml(lead.source)}</p>
    <p><b>Page:</b> ${escapeHtml(lead.page || "-")}</p>
    <p><b>Submitted at:</b> ${escapeHtml(submittedAt)}</p>
  `;

  await transporter.sendMail({
    from: CONTACT_FROM,
    to: CONTACT_TO,
    subject,
    text,
    html,
    replyTo: CONTACT_FROM,
  });
}

async function handleContact(req, res, corsOrigin) {
  if (!corsOrigin) {
    sendJson(res, 403, { ok: false, error: "ORIGIN_NOT_ALLOWED" }, "null");
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    sendJson(res, 429, { ok: false, error: "RATE_LIMITED" }, corsOrigin);
    return;
  }

  try {
    const body = await readJsonBody(req);
    const validation = validateLead(body);

    if (!validation.ok) {
      sendJson(res, 400, { ok: false, error: validation.error }, corsOrigin);
      return;
    }

    if (validation.spam) {
      sendJson(res, 200, { ok: true }, corsOrigin);
      return;
    }

    await Promise.all([sendLeadEmail(validation.lead), appendLeadToSheet(validation.lead)]);
    sendJson(res, 200, { ok: true }, corsOrigin);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.error("contact_submit_failed", message);

    if (message === "BODY_TOO_LARGE") {
      sendJson(res, 413, { ok: false, error: message }, corsOrigin);
      return;
    }

    if (message === "INVALID_JSON") {
      sendJson(res, 400, { ok: false, error: message }, corsOrigin);
      return;
    }

    if (message === "SMTP_NOT_CONFIGURED") {
      sendJson(res, 500, { ok: false, error: message }, corsOrigin);
      return;
    }

    sendJson(res, 500, { ok: false, error: "SEND_FAILED" }, corsOrigin);
  }
}

const server = http.createServer(async (req, res) => {
  const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
  const corsOrigin = getCorsOrigin(origin);
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {}, corsOrigin || "null");
    return;
  }

  if ((req.method === "GET" || req.method === "HEAD") && url.pathname === "/health") {
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
    await handleContact(req, res, corsOrigin);
    return;
  }

  sendJson(res, 404, { ok: false, error: "NOT_FOUND" }, corsOrigin || "*");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`contact-api listening on 0.0.0.0:${PORT}`);
});
