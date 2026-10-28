import { randomBytes } from "node:crypto";
import { FormError } from "./security.js";
import { CONTACT_KEY_PATTERN } from "./receipts.js";
import { definitelyRejected } from "./delivery.js";

export function createContactService({
  security,
  receipts,
  sendEmail,
  appendSheet,
  limit = 5,
  log = (entry) => console.log(JSON.stringify(entry)),
}) {
  const active = new Map();
  let stopping = false;
  let nextCleanup = 0;
  const cleanup = () => {
    if (Date.now() >= nextCleanup) {
      receipts.prune();
      nextCleanup = Date.now() + 60000;
    }
  };
  const cleanupTimer = setInterval(() => {
    try {
      cleanup();
    } catch {
      log({ event: "contact_maintenance_failed", code: "CONTACT_UNAVAILABLE" });
    }
  }, 60000);
  cleanupTimer.unref();

  async function deliver(row, lead) {
    const run = async (channel, send) => {
      if (row[`${channel}_state`] === "done") return;
      receipts.setChannel(row.id, channel, "sending");
      try {
        const result = await send(lead);
        if (channel === "mail" && result?.rejected?.length)
          throw Object.assign(new Error("RECIPIENT_REJECTED"), {
            code: result.accepted?.length
              ? "PARTIAL_SMTP_DELIVERY"
              : "RECIPIENT_REJECTED",
          });
        receipts.setChannel(row.id, channel, "done");
      } catch (error) {
        const state = definitelyRejected(error, channel) ? "failed" : "unknown";
        receipts.setChannel(row.id, channel, state);
        log({
          event: "contact_delivery_failed",
          receiptId: row.id,
          channel,
          code: state === "unknown" ? "DELIVERY_UNKNOWN" : "DELIVERY_REJECTED",
        });
      }
    };
    // A completed sink is never sent again when the other sink needs a retry.
    const results = await Promise.allSettled([
      run("mail", sendEmail),
      run("sheet", appendSheet),
    ]);
    if (results.some((result) => result.status === "rejected"))
      throw new FormError(503, "CONTACT_DELIVERY_UNKNOWN");
    const current = receipts.get(row.id);
    if (receipts.complete(current)) return { ok: true };
    throw new FormError(
      503,
      receipts.uncertain(current)
        ? "CONTACT_DELIVERY_UNKNOWN"
        : "CONTACT_DELIVERY_FAILED",
    );
  }

  return {
    reject(code) {
      log({ event: "contact_submit_rejected", code });
    },
    async close() {
      stopping = true;
      clearInterval(cleanupTimer);
      await Promise.allSettled([...active.values()]);
    },
    ready() {
      try {
        return receipts.ready();
      } catch {
        return false;
      }
    },
    async submit(req, lead) {
      if (stopping) throw new FormError(503, "CONTACT_UNAVAILABLE");
      const supplied = req.headers["idempotency-key"];
      if (
        (supplied !== undefined &&
          (typeof supplied !== "string" ||
            !CONTACT_KEY_PATTERN.test(supplied))) ||
        (security.bot.required && supplied === undefined)
      )
        throw new FormError(400, "INVALID_IDEMPOTENCY_KEY");
      const key = supplied || randomBytes(32).toString("hex");
      cleanup();
      const existing = receipts.find(key, lead);
      if (existing) {
        if (receipts.complete(existing)) return { ok: true, replayed: true };
        if (active.has(existing.id)) return active.get(existing.id);
        if (receipts.uncertain(existing))
          throw new FormError(503, "CONTACT_DELIVERY_UNKNOWN");
      }
      await security.bot.verify(
        req.headers["x-turnstile-token"],
        "contact_submit",
      );
      const row = receipts.reserve(key, lead);
      if (receipts.complete(row)) return { ok: true, replayed: true };
      if (active.has(row.id)) return active.get(row.id);
      if (receipts.uncertain(row))
        throw new FormError(503, "CONTACT_DELIVERY_UNKNOWN");
      const pending = deliver(row, lead).finally(() => active.delete(row.id));
      active.set(row.id, pending);
      return pending;
    },
    rate(req) {
      security.limiter.hit(security.resolveIp(req), "contact_submit", limit);
    },
  };
}
