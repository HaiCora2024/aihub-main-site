import { DatabaseSync } from "node:sqlite";
import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { FormError } from "./security.js";

const sha = (value) => createHash("sha256").update(value).digest("hex");
export const CONTACT_KEY_PATTERN = /^[a-f0-9]{64}$/;
const CHANNELS = new Set(["mail", "sheet"]);

function receiptSecret(filename, configured) {
  if (configured) {
    const secret = Buffer.from(configured, "base64");
    if (secret.length !== 32) throw new Error("INVALID_CONTACT_DEDUPE_KEY");
    return secret;
  }
  if (filename === ":memory:") return randomBytes(32);
  const keyPath = `${filename}.key`;
  if (!fs.existsSync(keyPath)) {
    if (fs.existsSync(filename)) throw new Error("CONTACT_RECEIPT_KEY_MISSING");
    fs.writeFileSync(keyPath, randomBytes(32), { flag: "wx", mode: 0o600 });
  }
  const secret = fs.readFileSync(keyPath);
  if (secret.length !== 32) throw new Error("INVALID_CONTACT_DEDUPE_KEY");
  fs.chmodSync(keyPath, 0o600);
  return secret;
}

export class ContactReceipts {
  constructor(
    filename = ":memory:",
    { secret, now = Date.now, capacity = 50000 } = {},
  ) {
    this.now = now;
    this.capacity = capacity;
    if (filename !== ":memory:")
      fs.mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
    this.secret = receiptSecret(filename, secret);
    this.db = new DatabaseSync(filename);
    if (filename !== ":memory:") fs.chmodSync(filename, 0o600);
    if (this.db.prepare("PRAGMA user_version").get().user_version > 1) {
      this.db.close();
      throw new Error("UNSUPPORTED_CONTACT_SCHEMA");
    }
    this.db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = FULL;
      PRAGMA secure_delete = ON;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY, content_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL,
        mail_state TEXT NOT NULL DEFAULT 'pending',
        sheet_state TEXT NOT NULL DEFAULT 'pending'
      );
      CREATE INDEX IF NOT EXISTS receipts_content ON receipts(content_hash, created_at);
      CREATE TABLE IF NOT EXISTS receipt_keys (
        key_hash TEXT PRIMARY KEY, body_hash TEXT NOT NULL,
        receipt_id TEXT NOT NULL REFERENCES receipts(id) ON DELETE CASCADE
      );
      UPDATE receipts SET mail_state='unknown' WHERE mail_state='sending';
      UPDATE receipts SET sheet_state='unknown' WHERE sheet_state='sending';
      PRAGMA user_version = 1;
    `);
    this.prune();
  }

  fingerprint(payload) {
    return createHmac("sha256", this.secret)
      .update(JSON.stringify(payload))
      .digest("hex");
  }

  contentFingerprint(payload) {
    const { name, email, phone } = payload;
    return this.fingerprint({ name, email, phone });
  }

  prune() {
    this.db
      .prepare("DELETE FROM receipts WHERE expires_at <= ?")
      .run(this.now());
  }

  find(key, payload) {
    const row = this.db
      .prepare(
        `SELECT receipts.*, receipt_keys.body_hash AS key_body_hash FROM receipts
      JOIN receipt_keys ON receipt_id=receipts.id
      WHERE key_hash=? AND expires_at > ?`,
      )
      .get(sha(key), this.now());
    if (row && row.key_body_hash !== this.fingerprint(payload))
      throw new FormError(409, "IDEMPOTENCY_CONFLICT");
    return row;
  }

  reserve(key, payload) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.prune();
      let row = this.find(key, payload);
      if (!row) {
        if (
          this.db.prepare("SELECT count(*) AS n FROM receipt_keys").get().n >=
          this.capacity
        )
          throw new FormError(503, "CONTACT_UNAVAILABLE");
        const time = this.now();
        const fingerprint = this.contentFingerprint(payload);
        row = this.db
          .prepare(
            "SELECT * FROM receipts WHERE content_hash=? AND created_at>=? ORDER BY created_at DESC LIMIT 1",
          )
          .get(fingerprint, time - 600000);
        if (!row) {
          const id = randomUUID();
          this.db
            .prepare(
              "INSERT INTO receipts(id,content_hash,created_at,expires_at) VALUES(?,?,?,?)",
            )
            .run(id, fingerprint, time, time + 86400000);
          row = this.get(id);
        }
        this.db
          .prepare(
            "INSERT INTO receipt_keys(key_hash,body_hash,receipt_id) VALUES(?,?,?)",
          )
          .run(sha(key), this.fingerprint(payload), row.id);
      }
      this.db.exec("COMMIT");
      return row;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  get(id) {
    return this.db.prepare("SELECT * FROM receipts WHERE id=?").get(id);
  }

  setChannel(id, channel, state) {
    if (
      !CHANNELS.has(channel) ||
      !["sending", "done", "failed", "unknown"].includes(state)
    )
      throw new Error("INVALID_DELIVERY_STATE");
    this.db
      .prepare(`UPDATE receipts SET ${channel}_state=? WHERE id=?`)
      .run(state, id);
  }

  complete(row) {
    return row.mail_state === "done" && row.sheet_state === "done";
  }
  uncertain(row) {
    return [row.mail_state, row.sheet_state].some(
      (state) => state === "unknown" || state === "sending",
    );
  }
  ready() {
    this.db.prepare("SELECT 1").get();
    return true;
  }
  close() {
    this.db.close();
  }
}
