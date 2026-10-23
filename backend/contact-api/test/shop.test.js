import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { createServer } from "../server.js";
import { createShopService } from "../shop/service.js";
import { ShopStore } from "../shop/store.js";
import { catalog, legal, validateSubmission, hash } from "../shop/contract.js";
import { backupStore, restoreStore } from "../shop/maintenance.js";
import nodemailer from "nodemailer";
import { startSmtpSink } from "./smtp-sink.js";

const key = () => randomBytes(32).toString("hex");
const payload = (overrides = {}) => ({
  locale: "en",
  customer: { name: "Test Buyer", email: "buyer@example.test", phone: "" },
  billing: {
    type: "individual",
    country: "PL",
    address: "Example Street 1",
    city: "Poznan",
    postalCode: "61-806",
  },
  items: [{ id: 1, qty: 2 }],
  catalogVersion: catalog.version,
  ...legal,
  termsAccepted: true,
  comment: "",
  website: "",
  ...overrides,
});

async function fixture(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "aihub-shop-api-"));
  const messages = [];
  const logs = [];
  const shop = createShopService({
    filename: path.join(directory, "shop.sqlite"),
    origins: ["https://aihub.works"],
    sendMail: async (mail) => {
      messages.push(mail);
      return { accepted: [mail.to] };
    },
    from: "AIHUB <sender@example.test>",
    log: (data) => logs.push(data),
    limit: 100,
    ...options,
  });
  const contact = [];
  const server = createServer({
    shopService: shop,
    contactEmail: async (p) => contact.push(["mail", p]),
    contactSheet: async (p) => contact.push(["sheet", p]),
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await shop.stop();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const submit = async (
    body = payload(),
    idempotencyKey = key(),
    extraHeaders = {},
  ) => {
    const response = await fetch(`${base}/api/shop/requests`, {
      method: "POST",
      headers: {
        Origin: "https://aihub.works",
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        ...extraHeaders,
      },
      body: JSON.stringify(body),
    });
    return { response, body: await response.json(), key: idempotencyKey };
  };
  return { directory, base, shop, submit, messages, logs, contact };
}

test("request is durable, priced on server, and produces two distinct notifications", async (t) => {
  const f = await fixture(t);
  const result = await f.submit({
    ...payload(),
    totalMinor: 1,
    currency: "USD",
    items: [{ id: 1, packageId: "start", qty: 2, unitPriceMinor: 1 }],
  });
  assert.equal(result.response.status, 201);
  assert.equal(result.body.request.estimatedTotalMinor, 360000);
  assert.equal(result.body.request.currency, "EUR");
  assert.equal(result.body.request.vatStatus, "pending_review");
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(f.messages.length, 2);
  const sales = f.messages.find((m) => m.to === "sales@aihubworks.com");
  const buyer = f.messages.find((m) => m.to === "buyer@example.test");
  assert.equal(sales.replyTo, "buyer@example.test");
  assert.equal(buyer.replyTo, "sales@aihubworks.com");
  assert.match(sales.text, /Example Street/);
  assert.doesNotMatch(buyer.text, /Example Street|Test Buyer/);
  assert.equal(f.contact.length, 0);
  assert.doesNotMatch(
    JSON.stringify(f.logs),
    /buyer@example.test|Example Street/,
  );
});

const estimate = async (t, items) => {
  const f = await fixture(t);
  const result = await f.submit(payload({ items }));
  return { f, result };
};

test("prices the selected package on the server", async (t) => {
  const { result } = await estimate(t, [
    { id: 1, packageId: "pro", qty: 2, unitPriceMinor: 1 },
  ]);
  assert.equal(result.response.status, 201);
  assert.equal(result.body.request.estimatedTotalMinor, 800000);
  assert.equal(result.body.request.currency, "EUR");
});

test("defaults a missing packageId to the cheapest package", async (t) => {
  const { result } = await estimate(t, [{ id: 1, qty: 1 }]);
  assert.equal(result.response.status, 201);
  assert.equal(result.body.request.estimatedTotalMinor, 180000);
});

test("rejects a package that belongs to another product", async (t) => {
  const { result } = await estimate(t, [{ id: 4, packageId: "pro", qty: 1 }]);
  assert.equal(result.response.status, 400);
  assert.equal(result.body.error.code, "VALIDATION_ERROR");
  assert.equal(result.body.error.fields.items, "invalid");
});

test("keeps two packages of one product as two lines", async (t) => {
  const { result } = await estimate(t, [
    { id: 1, packageId: "start", qty: 1 },
    { id: 1, packageId: "pro", qty: 1 },
  ]);
  assert.equal(result.response.status, 201);
  assert.equal(result.body.request.estimatedTotalMinor, 580000);
});

test("rejects duplicate product and package lines", async (t) => {
  const { result } = await estimate(t, [
    { id: 1, packageId: "start", qty: 1 },
    { id: 1, packageId: "start", qty: 1 },
  ]);
  assert.equal(result.response.status, 400);
  assert.equal(result.body.error.fields.items, "invalid");
});

test("names the package and net estimate in the sales email", async (t) => {
  const { f, result } = await estimate(t, [{ id: 1, packageId: "pro", qty: 1 }]);
  assert.equal(result.response.status, 201);
  await new Promise((resolve) => setTimeout(resolve, 20));
  const sales = f.messages.find((m) => m.to === "sales@aihubworks.com");
  assert.match(sales.text, /1 x AI Voice Assistant · Pro \(from 4000\.00 EUR\)/);
  assert.match(sales.text, /Indicative estimate, net/);
});

test("rejects more than eight request lines", async (t) => {
  const lines = catalog.products
    .flatMap((p) => p.packages.map((pkg) => ({ id: p.id, packageId: pkg.id, qty: 1 })))
    .slice(0, 9);
  const { result } = await estimate(t, lines);
  assert.equal(result.response.status, 400);
  assert.equal(result.body.error.fields.items, "invalid");
});

test("marks an estimate with an open-ended package as a lower bound", async (t) => {
  const { f } = await estimate(t, [{ id: 1, packageId: "pro", qty: 1 }]);
  await new Promise((resolve) => setTimeout(resolve, 20));
  for (const mail of f.messages)
    assert.match(mail.text, /Indicative estimate, net: from €4,000\.00/);
});

test("replays a request without packageId under the same key", async (t) => {
  const f = await fixture(t);
  const body = payload({ items: [{ id: 1, qty: 1 }] });
  const sameKey = key();
  const first = await f.submit(body, sameKey);
  const again = await f.submit(body, sameKey);
  assert.equal(first.response.status, 201);
  assert.equal(again.response.status, 200);
  assert.equal(again.body.replayed, true);
  assert.equal(again.body.request.id, first.body.request.id);
});

test("Nodemailer delivers both notifications to a local SMTP sink", async (t) => {
  const smtp = await startSmtpSink();
  const transport = nodemailer.createTransport(smtp.transportOptions);
  t.after(() => smtp.close());
  const f = await fixture(t, { sendMail: (mail) => transport.sendMail(mail) });
  assert.equal((await f.submit()).response.status, 201);
  for (let i = 0; i < 100 && smtp.messages.length < 2; i++)
    await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(smtp.messages.length, 2);
  assert.ok(
    smtp.messages.some((message) => /To: sales@aihubworks.com/.test(message)),
  );
  assert.ok(
    smtp.messages.some((message) => /To: buyer@example.test/.test(message)),
  );
});

test("encrypted backups rotate and reject tampering", async (t) => {
  let now = Date.now();
  const secret = randomBytes(32).toString("base64");
  const f = await fixture(t, { now: () => now, backupKey: secret });
  f.shop.maintain();
  const dir = path.join(f.directory, "backups");
  const first = path.join(dir, fs.readdirSync(dir)[0]);
  assert.equal(fs.statSync(first).mode & 0o777, 0o600);
  assert.doesNotMatch(
    fs.readFileSync(first, "utf8"),
    /Test Buyer|Example Street/,
  );
  const envelope = JSON.parse(fs.readFileSync(first));
  envelope.tag = randomBytes(16).toString("base64");
  const altered = path.join(f.directory, "altered.enc");
  fs.writeFileSync(altered, JSON.stringify(envelope));
  assert.throws(() =>
    restoreStore(
      path.join(f.directory, "bad.sqlite"),
      altered,
      f.shop.store.ledgerPath,
      secret,
      now,
    ),
  );
  assert.equal(fs.existsSync(path.join(f.directory, "bad.sqlite")), false);
  now += 8 * 86400000;
  f.shop.maintain();
  assert.equal(fs.existsSync(first), false);
  assert.equal(fs.readdirSync(dir).length, 1);
  const current = path.join(dir, fs.readdirSync(dir)[0]);
  assert.throws(
    () =>
      restoreStore(
        path.join(f.directory, "old.sqlite"),
        current,
        f.shop.store.ledgerPath,
        secret,
        now + 8 * 86400000,
      ),
    /EXPIRED/,
  );
});

test("maintenance failure closes readiness without deleting requests", async (t) => {
  const f = await fixture(t, { backupKey: "invalid" });
  await f.submit();
  f.shop.maintain();
  assert.equal(f.shop.ready(), false);
  assert.equal((await fetch(`${f.base}/health/ready`)).status, 503);
  assert.equal(f.shop.store.stats().requests, 1);
  assert.equal((await f.submit()).response.status, 503);
});

test("status transitions do not extend retention or reclassify contracts", async (t) => {
  let now = Date.now();
  const f = await fixture(t, { now: () => now });
  const r = await f.submit();
  f.shop.store.mark(r.body.request.id, "closed");
  const closedAt = f.shop.store.exportRequest(r.body.request.id).closed_at;
  now += 86400000;
  f.shop.store.mark(r.body.request.id, "closed");
  assert.equal(
    f.shop.store.exportRequest(r.body.request.id).closed_at,
    closedAt,
  );
  f.shop.store.mark(r.body.request.id, "converted");
  assert.throws(
    () => f.shop.store.mark(r.body.request.id, "closed"),
    /CANNOT_CLOSE/,
  );
});

test("offline ledger compaction keeps restoration-relevant records only", async (t) => {
  let now = Date.now();
  const f = await fixture(t, { now: () => now });
  const first = await f.submit();
  f.shop.store.erase(first.body.request.id);
  const active = await f.submit();
  f.shop.store.mark(active.body.request.id, "converted");
  assert.equal(f.shop.store.compactLedger(), 2);
  now += 91 * 86400000;
  f.shop.store.purge();
  assert.equal(f.shop.store.compactLedger(), 1);
  assert.match(fs.readFileSync(f.shop.store.ledgerPath, "utf8"), /converted/);
});

test("concurrent repeats create one request and two outbox records", async (t) => {
  const f = await fixture(t);
  const token = key();
  const results = await Promise.all(
    Array.from({ length: 10 }, () => f.submit(payload(), token)),
  );
  assert.equal(new Set(results.map((r) => r.body.request.id)).size, 1);
  assert.equal(results.filter((r) => r.response.status === 201).length, 1);
  assert.equal(f.shop.store.stats().requests, 1);
  assert.equal(
    f.shop.store.db.prepare("SELECT COUNT(*) AS n FROM outbox").get().n,
    2,
  );
  const changed = await f.submit(payload({ comment: "changed" }), token);
  assert.equal(changed.response.status, 409);
  assert.equal(changed.body.error.code, "IDEMPOTENCY_CONFLICT");
});

test("status requires the secret and exposes no billing or customer fields", async (t) => {
  const f = await fixture(t);
  const result = await f.submit();
  const unauthorized = await fetch(`${f.base}/api/shop/requests/status`);
  assert.equal(unauthorized.status, 401);
  const other = await fetch(`${f.base}/api/shop/requests/status`, {
    headers: { Authorization: `Bearer ${key()}` },
  });
  assert.equal(other.status, 404);
  const response = await fetch(`${f.base}/api/shop/requests/status`, {
    headers: { Authorization: `Bearer ${result.key}` },
  });
  const json = await response.json();
  assert.equal(json.request.id, result.body.request.id);
  assert.doesNotMatch(
    JSON.stringify(json),
    /customer|billing|Buyer|buyer@example|Street|61-806/,
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("CORS covers both credential headers and rejects untrusted origins", async (t) => {
  const f = await fixture(t);
  const ok = await fetch(`${f.base}/api/shop/requests`, {
    method: "OPTIONS",
    headers: {
      Origin: "https://aihub.works",
      "Access-Control-Request-Headers":
        "Content-Type, Idempotency-Key, Authorization",
    },
  });
  assert.equal(ok.status, 204);
  assert.match(
    ok.headers.get("access-control-allow-headers"),
    /Idempotency-Key, Authorization/,
  );
  const bad = await f.submit(payload(), key(), {
    Origin: "https://attacker.example",
  });
  assert.equal(bad.response.status, 403);
  assert.equal(bad.response.headers.get("access-control-allow-origin"), null);
});

test("validation, catalog and legal versions are enforced", async (t) => {
  const f = await fixture(t);
  const badBodies = [
    null,
    [],
    {},
    payload({ customer: { name: "x", email: "bad" } }),
    payload({
      customer: { name: "Test", email: "extra,recipient@example.test" },
    }),
    payload({
      customer: { name: "Test", email: "buyer@example.test;attacker" },
    }),
    payload({
      customer: { name: "Test\r\nBcc: hidden", email: "buyer@example.test" },
    }),
    payload({ termsAccepted: false }),
    payload({ items: [] }),
    payload({ items: [{ id: 999, qty: 1 }] }),
    payload({ items: [{ id: 1, qty: 0 }] }),
    payload({ items: [{ id: 1, qty: 1.5 }] }),
    payload({ items: [{ id: 1, qty: 100 }] }),
    payload({
      items: [
        { id: 1, qty: 1 },
        { id: 1, qty: 1 },
      ],
    }),
    payload({ website: "spam.example" }),
    payload({ billing: { ...payload().billing, country: "ZZ" } }),
    payload({ billing: { ...payload().billing, postalCode: "" } }),
    payload({
      billing: {
        ...payload().billing,
        type: "business",
        companyName: "Company",
        vatRegistered: true,
        vatId: "",
      },
    }),
  ];
  for (const body of badBodies)
    assert.equal((await f.submit(body)).response.status, 400);
  for (const [property, code] of [
    ["catalogVersion", "CATALOG_CHANGED"],
    ["termsVersion", "LEGAL_CHANGED"],
    ["privacyVersion", "LEGAL_CHANGED"],
  ]) {
    const r = await f.submit(payload({ [property]: "old" }));
    assert.equal(r.response.status, 409);
    assert.equal(r.body.error.code, code);
  }
  assert.equal(f.shop.store.stats().requests, 0);
});

test("B2B with and without VAT and countries without postcodes", async (t) => {
  const f = await fixture(t);
  for (const registered of [true, false]) {
    const r = await f.submit(
      payload({
        billing: {
          ...payload().billing,
          type: "business",
          companyName: "Test Company",
          vatRegistered: registered,
          vatId: registered ? "PL 1234567890" : "ignored",
        },
      }),
    );
    assert.equal(r.response.status, 201);
    const stored = f.shop.store.exportRequest(r.body.request.id);
    assert.equal(
      stored.payload.billing.vatId,
      registered ? "PL1234567890" : "",
    );
  }
  assert.equal(
    (
      await f.submit(
        payload({
          billing: { ...payload().billing, country: "AE", postalCode: "" },
        }),
      )
    ).response.status,
    201,
  );
});

test("request sizes, media types, invalid JSON and rate limits", async (t) => {
  const f = await fixture(t, { limit: 5 });
  const request = (body, type) =>
    fetch(`${f.base}/api/shop/requests`, {
      method: "POST",
      headers: { "Idempotency-Key": key(), "Content-Type": type },
      body,
    });
  assert.equal((await request("{}", "text/plain")).status, 415);
  assert.equal((await request("{", "application/json")).status, 400);
  assert.equal(
    (
      await request(
        JSON.stringify({ comment: "x".repeat(25000) }),
        "application/json",
      )
    ).status,
    413,
  );
  await f.submit();
  await f.submit();
  const limited = await f.submit();
  assert.equal(limited.response.status, 429);
  assert.equal(limited.response.headers.get("retry-after"), "900");
});

test("SMTP partial failure does not roll back acceptance or resend the successful job", async (t) => {
  let now = Date.now();
  let fail = true;
  const attempts = [];
  const f = await fixture(t, {
    now: () => now,
    sendMail: async (mail) => {
      attempts.push(mail.to);
      if (fail && mail.to === "sales@aihubworks.com")
        throw Object.assign(new Error("private SMTP response"), {
          code: "ETIMEDOUT",
        });
      return { accepted: [mail.to] };
    },
  });
  const r = await f.submit();
  assert.equal(r.response.status, 201);
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.equal(f.shop.store.stats().requests, 1);
  assert.equal(attempts.filter((x) => x === "buyer@example.test").length, 1);
  assert.doesNotMatch(JSON.stringify(f.logs), /private SMTP response/);
  fail = false;
  now += 60001;
  await f.shop.drain();
  assert.equal(attempts.filter((x) => x === "buyer@example.test").length, 1);
  assert.equal(
    f.shop.store.stats().outbox.find((x) => x.state === "sent").count,
    2,
  );
});

test("database restart preserves requests, dedupe and expired worker leases", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "aihub-shop-store-"));
  const filename = path.join(directory, "shop.sqlite");
  let now = Date.now();
  const token = key();
  const clean = validateSubmission(payload());
  let store = new ShopStore(filename, { now: () => now });
  const first = store.create(token, clean);
  store.claimMail();
  store.close();
  now += 120001;
  store = new ShopStore(filename, { now: () => now });
  assert.equal(store.create(token, clean).request.id, first.request.id);
  assert.equal(store.status(token).id, first.request.id);
  assert.ok(store.claimMail());
  store.close();
  fs.rmSync(directory, { recursive: true, force: true });
});

test("unavailable database fails closed without false success", async (t) => {
  const f = await fixture(t);
  f.shop.store.db.exec("DROP TABLE outbox");
  const r = await f.submit();
  assert.equal(r.response.status, 503);
  assert.equal(
    f.shop.store.db.prepare("SELECT COUNT(*) AS n FROM requests").get().n,
    0,
  );
});

test("outbox write failure rolls back the request transaction", async (t) => {
  const f = await fixture(t);
  f.shop.store.db.exec(
    "CREATE TRIGGER fail_outbox BEFORE INSERT ON outbox BEGIN SELECT RAISE(ABORT, 'TEST_STORAGE_FAILURE'); END",
  );
  assert.equal((await f.submit()).response.status, 503);
  assert.equal(f.shop.store.stats().requests, 0);
  assert.equal(
    f.shop.store.db.prepare("SELECT COUNT(*) AS n FROM outbox").get().n,
    0,
  );
  assert.equal(f.messages.length, 0);
});

test("contact API retains its original contract and both sinks", async (t) => {
  const f = await fixture(t);
  const response = await fetch(`${f.base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Lead",
      email: "lead@example.test",
      phone: "",
    }),
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(f.contact.map((x) => x[0]).sort(), ["mail", "sheet"]);
  assert.equal(f.shop.store.stats().requests, 0);
  assert.equal((await fetch(`${f.base}/health`)).status, 200);
  assert.equal((await fetch(`${f.base}//[`)).status, 400);
  assert.equal((await fetch(`${f.base}/health`)).status, 200);
});

test("retention, encrypted backup and erasure replay on restore", () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "aihub-shop-backup-"),
  );
  const filename = path.join(directory, "shop.sqlite");
  let now = Date.now();
  const secret = randomBytes(32).toString("base64");
  const store = new ShopStore(filename, { now: () => now });
  const token1 = key(),
    token2 = key();
  const first = store.create(token1, validateSubmission(payload()));
  const second = store.create(token2, validateSubmission(payload()));
  store.mark(first.request.id, "closed");
  store.mark(second.request.id, "converted");
  now += 90 * 86400000 + 1;
  const backup = backupStore(
    store,
    path.join(directory, "backups"),
    secret,
    now,
  );
  assert.doesNotMatch(
    fs.readFileSync(backup, "utf8"),
    /buyer@example.test|Test Buyer/,
  );
  assert.equal(store.purge(), 1);
  assert.throws(
    () => store.status(token1),
    (e) => e.code === "REQUEST_DELETED",
  );
  assert.equal(store.stats().requests, 1);
  const restoredFile = path.join(directory, "restored.sqlite");
  restoreStore(restoredFile, backup, store.ledgerPath, secret, now + 1);
  const restored = new ShopStore(restoredFile, { now: () => now + 1 });
  assert.equal(restored.stats().requests, 1);
  assert.throws(
    () => restored.status(token1),
    (e) => e.code === "REQUEST_DELETED",
  );
  assert.equal(restored.status(token2).id, second.request.id);
  assert.equal(
    restored.db.prepare("SELECT state FROM outbox LIMIT 1").get().state,
    "failed",
  );
  assert.throws(
    () =>
      restoreStore(
        path.join(directory, "expired.sqlite"),
        backup,
        store.ledgerPath,
        secret,
        now + 8 * 86400000,
      ),
    /BACKUP_EXPIRED/,
  );
  assert.equal(hash(token1).length, 64);
  restored.close();
  store.close();
  fs.rmSync(directory, { recursive: true, force: true });
});
