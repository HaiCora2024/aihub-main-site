import fs from "node:fs";
import path from "node:path";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { ShopStore } from "./store.js";
import { legal } from "./contract.js";

function encryptionKey(value) {
  const key = Buffer.from(value || "", "base64");
  if (key.length !== 32)
    throw new Error("SHOP_BACKUP_KEY_MUST_BE_32_BYTES_BASE64");
  return key;
}

export function backupStore(store, directory, secret, now = Date.now()) {
  const key = encryptionKey(secret);
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.chmodSync(directory, 0o700);
  const tmp = path.join(
    directory,
    `.snapshot-${randomBytes(8).toString("hex")}.sqlite`,
  );
  try {
    store.db.prepare("VACUUM INTO ?").run(tmp);
    fs.chmodSync(tmp, 0o600);
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const meta = Buffer.from(JSON.stringify({ createdAt: now, version: 1 }));
    cipher.setAAD(meta);
    const encrypted = Buffer.concat([
      cipher.update(fs.readFileSync(tmp)),
      cipher.final(),
    ]);
    const output = path.join(directory, `shop-${now}.enc`);
    fs.writeFileSync(
      output,
      JSON.stringify({
        meta: meta.toString("base64"),
        iv: iv.toString("base64"),
        tag: cipher.getAuthTag().toString("base64"),
        data: encrypted.toString("base64"),
      }),
      { mode: 0o600, flag: "wx" },
    );
    rotateBackups(directory, now);
    return output;
  } finally {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
  }
}

export function rotateBackups(directory, now = Date.now()) {
  if (!fs.existsSync(directory)) return;
  for (const file of fs.readdirSync(directory)) {
    const full = path.join(directory, file);
    const match = /^shop-(\d+)\.enc$/.exec(file);
    const orphan =
      /^\.snapshot-[a-f0-9]{16}\.sqlite$/.test(file) &&
      fs.statSync(full).mtimeMs < now - 3600000;
    if (
      orphan ||
      (match && Number(match[1]) < now - legal.backupRetentionDays * 86400000)
    )
      fs.unlinkSync(full);
  }
}

export function restoreStore(
  filename,
  backupFile,
  ledgerFile,
  secret,
  now = Date.now(),
) {
  if (!fs.existsSync(ledgerFile))
    throw new Error("LATEST_LIFECYCLE_LEDGER_REQUIRED");
  const sourceLedger = fs.readFileSync(ledgerFile);
  const envelope = JSON.parse(fs.readFileSync(backupFile, "utf8"));
  const meta = Buffer.from(envelope.meta, "base64");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    encryptionKey(secret),
    Buffer.from(envelope.iv, "base64"),
  );
  decipher.setAAD(meta);
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(envelope.data, "base64")),
    decipher.final(),
  ]);
  const { createdAt, version } = JSON.parse(meta);
  if (
    version !== 1 ||
    !Number.isSafeInteger(createdAt) ||
    createdAt > now ||
    createdAt < now - legal.backupRetentionDays * 86400000
  )
    throw new Error("BACKUP_EXPIRED_OR_INVALID");
  if (fs.existsSync(filename))
    throw new Error(
      "RESTORE_REQUIRES_NEW_TARGET_STOP_SERVICE_BEFORE_SWITCHING",
    );
  fs.mkdirSync(path.dirname(filename), { recursive: true, mode: 0o700 });
  fs.writeFileSync(filename, plaintext, { mode: 0o600, flag: "wx" });
  fs.writeFileSync(`${filename}.lifecycle.jsonl`, sourceLedger, {
    mode: 0o600,
    flag: "wx",
  });
  const restored = new ShopStore(filename, { now: () => now });
  try {
    const integrity = restored.db
      .prepare("PRAGMA integrity_check")
      .get().integrity_check;
    if (integrity !== "ok") throw new Error("BACKUP_INTEGRITY_FAILED");
    restored.purge();
    // Uncertain in-flight messages are reviewed, not blindly replayed after restoring a snapshot.
    restored.db.exec(
      "UPDATE outbox SET state='failed',lease_until=NULL,last_error='RESTORE_REVIEW_REQUIRED' WHERE state != 'sent'",
    );
  } finally {
    restored.close();
  }
}
