import { randomUUID, randomBytes } from "node:crypto";
import path from "node:path";
import { ShopStore } from "./store.js";
import {
  KEY_PATTERN,
  ShopError,
  hash,
  publicCatalog,
  validateSubmission,
} from "./contract.js";
import { shopMail } from "./mail.js";
import { backupStore, rotateBackups } from "./maintenance.js";

const MAX_BYTES = 20 * 1024;
function readBody(req) {
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers["content-type"] || ""))
    throw new ShopError(415, "UNSUPPORTED_MEDIA_TYPE");
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BYTES) {
        chunks.length = 0;
        reject(new ShopError(413, "BODY_TOO_LARGE"));
      } else chunks.push(chunk);
    });
    req.on("end", () => {
      if (bytes > MAX_BYTES) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new ShopError(400, "INVALID_JSON"));
      }
    });
    req.on("error", () => reject(new ShopError(400, "INVALID_REQUEST")));
    req.on("aborted", () => reject(new ShopError(400, "INVALID_REQUEST")));
  });
}

export function createShopService({
  filename,
  origins,
  sendMail,
  from,
  salesTo,
  siteUrl,
  backupKey,
  backupDirectory = path.join(path.dirname(filename), "backups"),
  log = (record) => console.log(JSON.stringify(record)),
  now = () => Date.now(),
  limit = 5,
  trustProxyHops = 0,
}) {
  const store = new ShopStore(filename, { now });
  const rateSalt = randomBytes(32).toString("hex");
  const rates = new Map();
  let busy = false;
  let stopping = false;
  let timer;
  let cleanupTimer;
  let lastBackup = 0;
  let backupHealthy = true;
  const maintain = () => {
    try {
      if (backupKey) rotateBackups(backupDirectory, now());
      store.purge();
      if (backupKey && (!lastBackup || now() - lastBackup >= 86400000)) {
        backupStore(store, backupDirectory, backupKey, now());
        lastBackup = now();
      }
      backupHealthy = true;
    } catch {
      backupHealthy = false;
      log({
        event: "shop_maintenance_failed",
        code: "STORAGE_MAINTENANCE_FAILED",
      });
    }
  };
  const rate = (req, group, max) => {
    const chain = String(req.headers["x-forwarded-for"] || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const ip =
      trustProxyHops > 0 && chain.length >= trustProxyHops
        ? chain[chain.length - trustProxyHops]
        : req.socket.remoteAddress;
    const key = hash(`${rateSalt}:${group}:${ip}`);
    const time = now();
    for (const [k, record] of rates) if (record.reset <= time) rates.delete(k);
    if (rates.size >= 10000 && !rates.has(key))
      throw new ShopError(429, "RATE_LIMITED");
    const record = rates.get(key) || { count: 0, reset: time + 15 * 60000 };
    record.count++;
    rates.set(key, record);
    if (record.count > max) throw new ShopError(429, "RATE_LIMITED");
  };

  const drain = async () => {
    if (busy || stopping) return;
    busy = true;
    try {
      for (let i = 0; i < 20 && !stopping; i++) {
        const job = store.claimMail();
        if (!job) break;
        try {
          const result = await sendMail(
            shopMail(job, { from, salesTo, siteUrl }),
          );
          if (result?.rejected?.length)
            throw Object.assign(new Error("RECIPIENT_REJECTED"), {
              code: "RECIPIENT_REJECTED",
            });
          store.completeMail(job.id);
        } catch (e) {
          const code = [
            "EAUTH",
            "ECONNECTION",
            "ETIMEDOUT",
            "ESOCKET",
            "EENVELOPE",
            "RECIPIENT_REJECTED",
          ].includes(e.code)
            ? e.code
            : "SMTP_FAILED";
          store.failMail(job.id, job.attempts, code);
          log({
            event: "shop_mail_failed",
            requestId: job.request_id,
            kind: job.kind,
            attempt: job.attempts,
            code,
          });
        }
      }
    } catch {
      log({ event: "shop_worker_failed", code: "STORE_UNAVAILABLE" });
    } finally {
      busy = false;
    }
  };

  return {
    store,
    drain,
    maintain,
    ready() {
      try {
        store.stats();
        return backupHealthy;
      } catch {
        return false;
      }
    },
    start() {
      maintain();
      timer = setInterval(() => void drain(), 5000);
      timer.unref();
      cleanupTimer = setInterval(maintain, 3600000);
      cleanupTimer.unref();
      void drain();
    },
    async stop() {
      stopping = true;
      clearInterval(timer);
      clearInterval(cleanupTimer);
      while (busy) await new Promise((resolve) => setTimeout(resolve, 10));
      store.close();
    },
    async handle(req, res, pathname) {
      const requestId = randomUUID();
      const origin = req.headers.origin;
      const allowed = !origin || origins.includes(origin);
      const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        Vary: "Origin",
        "X-Content-Type-Options": "nosniff",
        "X-Request-ID": requestId,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Idempotency-Key, Authorization",
        "Access-Control-Expose-Headers": "X-Request-ID, Retry-After",
        ...(origin && allowed ? { "Access-Control-Allow-Origin": origin } : {}),
      };
      const reply = (status, body) => {
        res.writeHead(status, {
          ...headers,
          ...(status === 429 ? { "Retry-After": "900" } : {}),
        });
        res.end(
          status === 204 ? undefined : JSON.stringify({ ...body, requestId }),
        );
      };
      try {
        if (!allowed) throw new ShopError(403, "ORIGIN_NOT_ALLOWED");
        const routes = [
          "/api/shop/catalog",
          "/api/shop/requests",
          "/api/shop/requests/status",
        ];
        if (!routes.includes(pathname)) throw new ShopError(404, "NOT_FOUND");
        if (req.method === "OPTIONS") {
          reply(204, {});
          return;
        }
        if (!this.ready()) throw new ShopError(503, "SHOP_UNAVAILABLE");
        if (req.method === "GET" && pathname === "/api/shop/catalog") {
          reply(200, publicCatalog());
          return;
        }
        if (req.method === "GET" && pathname === "/api/shop/requests/status") {
          rate(req, "status", 120);
          const key = String(req.headers.authorization || "").replace(
            /^Bearer /,
            "",
          );
          if (!KEY_PATTERN.test(key))
            throw new ShopError(401, "INVALID_CREDENTIAL");
          reply(200, { request: store.status(key) });
          return;
        }
        if (req.method === "POST" && pathname === "/api/shop/requests") {
          rate(req, "submit", limit);
          const key = req.headers["idempotency-key"];
          if (typeof key !== "string" || !KEY_PATTERN.test(key))
            throw new ShopError(400, "INVALID_IDEMPOTENCY_KEY");
          const payload = validateSubmission(await readBody(req));
          const result = store.create(key, payload);
          reply(result.replayed ? 200 : 201, result);
          void drain();
          return;
        }
        throw new ShopError(405, "METHOD_NOT_ALLOWED");
      } catch (error) {
        const known = error instanceof ShopError;
        if (!known)
          log({
            event: "shop_request_failed",
            requestId,
            code: "STORE_UNAVAILABLE",
          });
        reply(known ? error.status : 503, {
          error: {
            code: known ? error.code : "SHOP_UNAVAILABLE",
            fields: known ? error.fields : {},
          },
        });
      }
    },
  };
}
