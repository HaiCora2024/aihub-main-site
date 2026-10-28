import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  ShopError,
  hash,
  checkVersions,
  priceItems,
  catalog,
  legal,
} from "./contract.js";

export class ShopStore {
  constructor(filename, { now = () => Date.now() } = {}) {
    this.now = now;
    this.filename = filename;
    this.ledgerPath =
      filename === ":memory:" ? null : `${filename}.lifecycle.jsonl`;
    if (filename !== ":memory:")
      fs.mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(filename);
    if (this.db.prepare("PRAGMA user_version").get().user_version > 1) {
      this.db.close();
      throw new Error("UNSUPPORTED_SCHEMA_VERSION");
    }
    if (filename !== ":memory:") fs.chmodSync(filename, 0o600);
    this.db.exec(`
      PRAGMA foreign_keys = ON;
      PRAGMA journal_mode = DELETE;
      PRAGMA synchronous = FULL;
      PRAGMA secure_delete = ON;
      PRAGMA busy_timeout = 5000;
      CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY, key_hash TEXT UNIQUE NOT NULL, body_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL, closed_at INTEGER, status TEXT NOT NULL DEFAULT 'open',
        payload TEXT NOT NULL, items TEXT NOT NULL, total_minor INTEGER NOT NULL,
        currency TEXT NOT NULL, catalog_version TEXT NOT NULL,
        terms_version TEXT NOT NULL, privacy_version TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS outbox (
        id TEXT PRIMARY KEY, request_id TEXT NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
        kind TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
        next_at INTEGER NOT NULL, lease_until INTEGER, sent_at INTEGER, last_error TEXT,
        UNIQUE(request_id, kind)
      );
      CREATE INDEX IF NOT EXISTS outbox_due ON outbox(state, next_at);
      CREATE TABLE IF NOT EXISTS deletions (key_hash TEXT PRIMARY KEY, deleted_at INTEGER NOT NULL);
      PRAGMA user_version = 1;
    `);
    if (this.ledgerPath) fs.closeSync(fs.openSync(this.ledgerPath, "a", 0o600));
    this.applyLedger();
  }

  transaction(fn) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const value = fn();
      this.db.exec("COMMIT");
      return value;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  summary(row) {
    return {
      id: row.id,
      createdAt: new Date(row.created_at).toISOString(),
      status: "received",
      mode: "request",
      currency: row.currency,
      estimatedTotalMinor: row.total_minor,
      vatStatus: "pending_review",
    };
  }

  replay(key, payload) {
    const keyHash = hash(key);
    const bodyHash = hash(JSON.stringify(payload));
    if (
      this.db.prepare("SELECT 1 FROM deletions WHERE key_hash = ?").get(keyHash)
    )
      throw new ShopError(410, "REQUEST_DELETED");
    const existing = this.db
      .prepare("SELECT * FROM requests WHERE key_hash = ?")
      .get(keyHash);
    if (existing) {
      if (existing.body_hash !== bodyHash)
        throw new ShopError(409, "IDEMPOTENCY_CONFLICT");
      return { request: this.summary(existing), replayed: true };
    }
    return null;
  }

  create(key, payload) {
    return this.transaction(() => {
      const existing = this.replay(key, payload);
      if (existing) return existing;
      const keyHash = hash(key);
      const bodyHash = hash(JSON.stringify(payload));
      checkVersions(payload);
      const now = this.now();
      const id = `REQ-${randomUUID().toUpperCase()}`;
      const items = priceItems(payload.items);
      const total = items.reduce((sum, p) => sum + p.qty * p.unitPriceMinor, 0);
      this.db
        .prepare(
          `INSERT INTO requests
        (id,key_hash,body_hash,created_at,payload,items,total_minor,currency,catalog_version,terms_version,privacy_version)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        )
        .run(
          id,
          keyHash,
          bodyHash,
          now,
          JSON.stringify(payload),
          JSON.stringify(items),
          total,
          catalog.currency,
          payload.catalogVersion,
          payload.termsVersion,
          payload.privacyVersion,
        );
      const enqueue = this.db.prepare(
        "INSERT INTO outbox (id,request_id,kind,next_at) VALUES (?,?,?,?)",
      );
      enqueue.run(randomUUID(), id, "sales", now);
      enqueue.run(randomUUID(), id, "customer", now);
      return {
        request: this.summary(
          this.db.prepare("SELECT * FROM requests WHERE id = ?").get(id),
        ),
        replayed: false,
      };
    });
  }

  status(key) {
    const keyHash = hash(key);
    const row = this.db
      .prepare("SELECT * FROM requests WHERE key_hash = ?")
      .get(keyHash);
    if (row) return this.summary(row);
    if (
      this.db.prepare("SELECT 1 FROM deletions WHERE key_hash = ?").get(keyHash)
    )
      throw new ShopError(410, "REQUEST_DELETED");
    throw new ShopError(404, "REQUEST_NOT_FOUND");
  }

  claimMail() {
    return this.transaction(() => {
      const now = this.now();
      this.db
        .prepare(
          "UPDATE outbox SET state='failed', last_error='DELIVERY_UNKNOWN', lease_until=NULL WHERE state='sending' AND lease_until < ?",
        )
        .run(now);
      const job = this.db
        .prepare(
          "SELECT * FROM outbox WHERE state='pending' AND next_at <= ? ORDER BY next_at,id LIMIT 1",
        )
        .get(now);
      if (!job) return null;
      this.db
        .prepare(
          "UPDATE outbox SET state='sending', attempts=attempts+1, lease_until=? WHERE id=?",
        )
        .run(now + 120000, job.id);
      const request = this.db
        .prepare("SELECT * FROM requests WHERE id=?")
        .get(job.request_id);
      return {
        ...job,
        attempts: job.attempts + 1,
        request: {
          ...request,
          payload: JSON.parse(request.payload),
          items: JSON.parse(request.items),
        },
      };
    });
  }

  completeMail(id) {
    this.db
      .prepare(
        "UPDATE outbox SET state='sent', sent_at=?, lease_until=NULL, last_error=NULL WHERE id=?",
      )
      .run(this.now(), id);
  }

  holdMail(id, code) {
    this.db
      .prepare(
        "UPDATE outbox SET state='failed', lease_until=NULL, last_error=? WHERE id=?",
      )
      .run(code, id);
  }

  failMail(id, attempts, code) {
    const delay = [
      60000, 300000, 900000, 3600000, 14400000, 43200000, 86400000,
    ][Math.min(attempts - 1, 6)];
    this.db
      .prepare(
        "UPDATE outbox SET state=?, next_at=?, lease_until=NULL, last_error=? WHERE id=?",
      )
      .run(attempts >= 8 ? "failed" : "pending", this.now() + delay, code, id);
  }

  mark(id, status) {
    if (!["closed", "converted"].includes(status))
      throw new Error("INVALID_STATUS");
    const row = this.db
      .prepare("SELECT key_hash,status FROM requests WHERE id=?")
      .get(id);
    if (!row) throw new Error("REQUEST_NOT_FOUND");
    if (row.status === status) return;
    if (row.status === "converted" && status === "closed")
      throw new Error("CANNOT_CLOSE_CONVERTED_REQUEST");
    const at = this.now();
    this.journal({ keyHash: row.key_hash, action: status, at });
    this.db
      .prepare("UPDATE requests SET status=?,closed_at=? WHERE id=?")
      .run(status, status === "closed" ? at : null, id);
  }

  erase(id) {
    return this.transaction(() => {
      const row = this.db
        .prepare("SELECT key_hash FROM requests WHERE id=?")
        .get(id);
      if (!row) return false;
      this.journal({ keyHash: row.key_hash, action: "erased", at: this.now() });
      this.db
        .prepare("INSERT OR REPLACE INTO deletions VALUES (?,?)")
        .run(row.key_hash, this.now());
      this.db.prepare("DELETE FROM requests WHERE id=?").run(id);
      return true;
    });
  }

  purge() {
    const cutoff = this.now() - legal.closedRequestRetentionDays * 86400000;
    const rows = this.db
      .prepare("SELECT id FROM requests WHERE status='closed' AND closed_at<=?")
      .all(cutoff);
    for (const row of rows) this.erase(row.id);
    this.db
      .prepare("DELETE FROM deletions WHERE deleted_at<?")
      .run(this.now() - 90 * 86400000);
    return rows.length;
  }

  exportRequest(id) {
    const row = this.db.prepare("SELECT * FROM requests WHERE id=?").get(id);
    if (!row) throw new Error("REQUEST_NOT_FOUND");
    const { key_hash, body_hash, ...data } = row;
    return {
      ...data,
      payload: JSON.parse(row.payload),
      items: JSON.parse(row.items),
    };
  }

  stats() {
    return {
      requests: this.db.prepare("SELECT COUNT(*) AS count FROM requests").get()
        .count,
      outbox: this.db
        .prepare("SELECT state, COUNT(*) AS count FROM outbox GROUP BY state")
        .all(),
    };
  }

  close() {
    this.db.close();
  }

  journal(record) {
    if (!this.ledgerPath) return;
    const fd = fs.openSync(this.ledgerPath, "a", 0o600);
    try {
      fs.writeSync(fd, `${JSON.stringify(record)}\n`);
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
  }

  applyLedger() {
    if (!this.ledgerPath || !fs.existsSync(this.ledgerPath)) return;
    const records = fs
      .readFileSync(this.ledgerPath, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line));
    this.transaction(() => {
      for (const r of records) {
        if (
          !/^[a-f0-9]{64}$/.test(r.keyHash) ||
          !Number.isSafeInteger(r.at) ||
          !["closed", "converted", "erased"].includes(r.action)
        )
          throw new Error("INVALID_LIFECYCLE_LEDGER");
        if (r.action === "erased") {
          this.db
            .prepare("DELETE FROM requests WHERE key_hash=?")
            .run(r.keyHash);
          this.db
            .prepare("INSERT OR REPLACE INTO deletions VALUES (?,?)")
            .run(r.keyHash, r.at);
        } else {
          this.db
            .prepare(
              "UPDATE requests SET status=?,closed_at=? WHERE key_hash=?",
            )
            .run(r.action, r.action === "closed" ? r.at : null, r.keyHash);
        }
      }
    });
    // Append-only while the service is live: compacting concurrently could lose an erasure.
  }

  compactLedger() {
    if (!this.ledgerPath) return;
    // Operator must stop the API and other admin commands before replacing this file.
    const latest = new Map();
    for (const line of fs
      .readFileSync(this.ledgerPath, "utf8")
      .split("\n")
      .filter(Boolean)) {
      const r = JSON.parse(line);
      latest.set(r.keyHash, r);
    }
    const cutoff = this.now() - 90 * 86400000;
    const records = [...latest.values()].filter(
      (r) =>
        r.at >= cutoff ||
        this.db
          .prepare("SELECT 1 FROM requests WHERE key_hash=?")
          .get(r.keyHash),
    );
    const temporary = `${this.ledgerPath}.compact`;
    const fd = fs.openSync(temporary, "wx", 0o600);
    try {
      fs.writeSync(fd, records.map((r) => JSON.stringify(r) + "\n").join(""));
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    fs.renameSync(temporary, this.ledgerPath);
    return records.length;
  }
}
