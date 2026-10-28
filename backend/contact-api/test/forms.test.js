import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "../server.js";
import { createShopService } from "../shop/service.js";
import { catalog, legal } from "../shop/contract.js";
import {
  createBotCheck,
  createFormSecurity,
  createIpResolver,
  createRateLimiter,
} from "../forms/security.js";
import { ContactReceipts } from "../forms/receipts.js";
import { createContactService } from "../forms/contact.js";

const key = () => randomBytes(32).toString("hex");
const contact = () => ({
  name: "Test Human",
  email: "human@example.test",
  phone: "+48123456789",
  website: "",
  source: "aihub-site",
  page: "https://aihub.works/",
});
const shopPayload = () => ({
  locale: "en",
  customer: { name: "Test Buyer", email: "buyer@example.test", phone: "" },
  billing: {
    type: "individual",
    country: "PL",
    address: "Example Street 1",
    city: "Poznan",
    postalCode: "61-806",
  },
  items: [{ id: 1, packageId: "start", qty: 1 }],
  catalogVersion: catalog.version,
  ...legal,
  termsAccepted: true,
  comment: "",
  website: "",
});

async function fixture(t, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "aihub-forms-"));
  const filename = path.join(directory, "receipts.sqlite");
  const receipts = new ContactReceipts(filename, options.receiptOptions);
  const actions = [];
  const logs = [];
  const calls = { mail: 0, sheet: 0, verify: 0, shop: 0 };
  const spent = new Set();
  const security = createFormSecurity({
    required: true,
    secretKey: "unit-test-server-secret",
    hostnames: ["aihub.works"],
    production: false,
    fetchImpl: async (_url, init) => {
      calls.verify++;
      const { response } = JSON.parse(init.body);
      const action = response.split(":")[0];
      actions.push(action);
      const success =
        !spent.has(response) && !["bad", "expired"].includes(response);
      spent.add(response);
      return {
        ok: true,
        json: async () => ({
          success,
          hostname: "aihub.works",
          action,
          "error-codes": success ? [] : ["timeout-or-duplicate"],
        }),
      };
    },
    ...options.security,
  });
  const shop = createShopService({
    filename: path.join(directory, "shop.sqlite"),
    origins: ["https://aihub.works"],
    sendMail: async () => {
      calls.shop++;
    },
    from: "sender@example.test",
    formSecurity: security,
    limit: options.limit || 100,
    log: (entry) => logs.push(entry),
  });
  const server = createServer({
    shopService: shop,
    formSecurity: security,
    contactReceipts: receipts,
    contactLimit: options.limit || 100,
    contactLog: (entry) => logs.push(entry),
    contactEmail: async (lead) => {
      calls.mail++;
      return options.mail?.(lead);
    },
    contactSheet: async (lead) => {
      calls.sheet++;
      return options.sheet?.(lead);
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await shop.stop();
    receipts.close();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const submit = async (
    kind = "contact",
    body = kind === "contact" ? contact() : shopPayload(),
    submissionKey = key(),
    token = `${kind === "contact" ? "contact_submit" : "shop_submit"}:${key()}`,
    extra = {},
  ) => {
    const response = await fetch(
      `${base}/api/${kind === "contact" ? "contact" : "shop/requests"}`,
      {
        method: "POST",
        headers: {
          Origin: "https://aihub.works",
          "Content-Type": "application/json",
          "Idempotency-Key": submissionKey,
          ...(token !== null ? { "X-Turnstile-Token": token } : {}),
          ...extra,
        },
        body: JSON.stringify(body),
      },
    );
    return { response, body: await response.json(), key: submissionKey };
  };
  return {
    base,
    filename,
    receipts,
    security,
    shop,
    submit,
    calls,
    actions,
    logs,
  };
}

test("both forms require a valid token before any side effect", async (t) => {
  const f = await fixture(t);
  for (const kind of ["contact", "shop"])
    for (const token of [null, "bad", "expired", "x".repeat(2049)]) {
      const result = await f.submit(kind, undefined, key(), token);
      assert.equal(result.response.status, 403);
      assert.equal(
        kind === "contact" ? result.body.error : result.body.error.code,
        "BOT_CHECK_FAILED",
      );
    }
  assert.equal(f.calls.mail + f.calls.sheet + f.calls.shop, 0);
  assert.equal(f.shop.store.stats().requests, 0);
  assert.equal(
    f.receipts.db.prepare("SELECT count(*) AS n FROM receipts").get().n,
    0,
  );
});

test("valid checks have endpoint-specific actions and do not enter saved payloads", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.submit()).response.status, 200);
  const request = await f.submit("shop");
  assert.equal(request.response.status, 201);
  await f.shop.drain();
  assert.deepEqual(f.actions, ["contact_submit", "shop_submit"]);
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 1);
  assert.equal(f.calls.shop, 2);
  const stored = f.shop.store.db
    .prepare("SELECT payload FROM requests")
    .get().payload;
  assert.doesNotMatch(stored, /turnstile|token|shop_submit/);
  const journal = fs.readFileSync(f.filename).toString("utf8");
  assert.doesNotMatch(
    journal,
    /Test Human|human@example.test|123456789|unit-test-server-secret|contact_submit/,
  );
  assert.doesNotMatch(
    JSON.stringify(f.logs),
    /human@example.test|buyer@example.test|unit-test-server-secret/,
  );
});

test("wrong hostname or form action fails closed", async () => {
  for (const result of [
    { success: true, hostname: "attacker.example", action: "contact_submit" },
    { success: true, hostname: "aihub.works", action: "shop_submit" },
  ]) {
    const checker = createBotCheck({
      required: true,
      secretKey: "test-secret",
      hostnames: ["aihub.works"],
      fetchImpl: async () => ({ ok: true, json: async () => result }),
    });
    await assert.rejects(checker.verify("token", "contact_submit"), {
      status: 403,
      code: "BOT_CHECK_FAILED",
    });
  }
});

test("verification timeout, invalid responses and provider errors are unavailable, not success", async () => {
  for (const fetchImpl of [
    async () => new Promise(() => {}),
    async () => {
      throw new Error("private network detail");
    },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({}) }),
    async () => ({
      ok: true,
      json: async () => ({ success: false, "error-codes": ["internal-error"] }),
    }),
  ]) {
    const checker = createBotCheck({
      required: true,
      secretKey: "test-secret",
      hostnames: ["aihub.works"],
      timeoutMs: 15,
      fetchImpl,
    });
    await assert.rejects(checker.verify("token", "contact_submit"), {
      status: 503,
      code: "BOT_CHECK_UNAVAILABLE",
    });
  }
});

test("a used provider token cannot create another submission", async (t) => {
  const f = await fixture(t);
  const token = `contact_submit:${key()}`;
  assert.equal(
    (await f.submit("contact", contact(), key(), token)).response.status,
    200,
  );
  const rejected = await f.submit(
    "contact",
    { ...contact(), name: "Different Buyer" },
    key(),
    token,
  );
  assert.equal(rejected.response.status, 403);
  assert.equal(f.calls.mail, 1);
});

test("accepted shop and contact replays need no fresh token and reject changed payloads", async (t) => {
  const f = await fixture(t);
  for (const kind of ["contact", "shop"]) {
    const original = await f.submit(kind);
    const attempts = f.calls.verify;
    const replay = await f.submit(kind, undefined, original.key, null);
    assert.equal(replay.response.status, 200);
    assert.equal(replay.body.replayed, true);
    assert.equal(f.calls.verify, attempts);
    const body =
      kind === "contact"
        ? { ...contact(), phone: "+48999999999" }
        : { ...shopPayload(), comment: "changed" };
    assert.equal(
      (await f.submit(kind, body, original.key, null)).response.status,
      409,
    );
  }
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 1);
  assert.equal(f.shop.store.stats().requests, 1);
});

test("parallel repeats and new keys for identical contact content share both sinks", async (t) => {
  const f = await fixture(t, {
    mail: async () => new Promise((resolve) => setTimeout(resolve, 40)),
  });
  const submissionKey = key();
  const results = await Promise.all(
    Array.from({ length: 6 }, () =>
      f.submit("contact", contact(), submissionKey),
    ),
  );
  assert.ok(results.every((result) => result.response.status === 200));
  assert.equal((await f.submit()).response.status, 200);
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 1);
});

test("definitive partial failure retries only the failed sink", async (t) => {
  let fail = true;
  const f = await fixture(t, {
    sheet: async () => {
      if (fail)
        throw Object.assign(new Error("private sheet error"), { code: 403 });
    },
  });
  const original = await f.submit();
  assert.equal(original.response.status, 503);
  assert.equal(original.body.error, "CONTACT_DELIVERY_FAILED");
  fail = false;
  assert.equal(
    (await f.submit("contact", contact(), original.key)).response.status,
    200,
  );
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 2);
  assert.doesNotMatch(JSON.stringify(f.logs), /private sheet error/);
});

test("contact deduplication ignores tracking metadata while each key still binds its full payload", async (t) => {
  const f = await fixture(t);
  await f.submit();
  const alternate = {
    ...contact(),
    page: "https://aihub.works/?utm_source=test#contact",
    source: "another-tracking-label",
  };
  const repeated = await f.submit("contact", alternate);
  assert.equal(repeated.response.status, 200);
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 1);
  assert.equal(
    (await f.submit("contact", alternate, repeated.key, null)).response.status,
    200,
  );
  assert.equal(
    (await f.submit("contact", contact(), repeated.key, null)).response.status,
    409,
  );
});

test("unknown delivery never automatically retries either sink", async (t) => {
  const f = await fixture(t, {
    mail: async () => {
      throw Object.assign(new Error("private SMTP timeout"), {
        code: "ETIMEDOUT",
      });
    },
  });
  const original = await f.submit();
  assert.equal(original.body.error, "CONTACT_DELIVERY_UNKNOWN");
  assert.equal(
    (await f.submit("contact", contact(), original.key)).body.error,
    "CONTACT_DELIVERY_UNKNOWN",
  );
  assert.equal((await f.submit()).body.error, "CONTACT_DELIVERY_UNKNOWN");
  assert.equal(f.calls.mail, 1);
  assert.equal(f.calls.sheet, 1);
});

test("honeypots reject bots without calling verification or delivery", async (t) => {
  const f = await fixture(t);
  await f.submit("contact", { ...contact(), website: "spam.example" });
  assert.equal(
    (await f.submit("shop", { ...shopPayload(), website: "spam.example" }))
      .response.status,
    400,
  );
  assert.deepEqual(f.calls, { mail: 0, sheet: 0, verify: 0, shop: 0 });
});

test("both endpoints rate limit spoofed forwarding headers independently", async (t) => {
  const f = await fixture(t, { limit: 5 });
  for (const kind of ["contact", "shop"]) {
    for (let n = 0; n < 5; n++)
      await f.submit(kind, undefined, key(), null, {
        "X-Forwarded-For": `198.51.100.${n}`,
      });
    const rejected = await f.submit(kind);
    assert.equal(rejected.response.status, 429);
    assert.ok(Number(rejected.response.headers.get("retry-after")) > 0);
  }
  assert.equal(f.calls.verify, 0);
});

test("CORS explicitly allows form proof headers", async (t) => {
  const f = await fixture(t);
  for (const pathname of ["/api/contact", "/api/shop/requests"]) {
    const response = await fetch(`${f.base}${pathname}`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://aihub.works",
        "Access-Control-Request-Headers": "X-Turnstile-Token, Idempotency-Key",
      },
    });
    assert.equal(response.status, 204);
    assert.match(
      response.headers.get("access-control-allow-headers"),
      /X-Turnstile-Token/,
    );
    assert.match(
      response.headers.get("access-control-allow-headers"),
      /Idempotency-Key/,
    );
  }
});

test("trusted proxy resolution ignores attacker prefixes and untrusted peers", () => {
  const request = (peer, forwarded) => ({
    socket: { remoteAddress: peer },
    headers: { "x-forwarded-for": forwarded },
  });
  assert.equal(
    createIpResolver()(request("::ffff:203.0.113.7", "198.51.100.1")),
    "203.0.113.7",
  );
  const resolve = createIpResolver({
    trustedProxyHops: 1,
    trustedProxyCidrs: ["10.0.0.0/24"],
  });
  assert.equal(
    resolve(request("10.0.0.8", "198.51.100.1,203.0.113.7")),
    "203.0.113.7",
  );
  assert.equal(resolve(request("203.0.113.8", "198.51.100.1")), "203.0.113.8");
  assert.equal(resolve(request("10.0.0.8", "invalid")), "10.0.0.8");
  const resolveTwo = createIpResolver({
    trustedProxyHops: 2,
    trustedProxyCidrs: ["10.0.0.0/24"],
  });
  assert.equal(
    resolveTwo(request("10.0.0.8", "198.51.100.1,203.0.113.7,10.0.0.9")),
    "203.0.113.7",
  );
  assert.equal(
    resolveTwo(request("10.0.0.8", "203.0.113.7,198.51.100.2")),
    "10.0.0.8",
  );
  assert.equal(createIpResolver()(request("2001:0DB8:0:0::1")), "2001:db8::1");
  assert.throws(
    () => createIpResolver({ trustedProxyHops: 1 }),
    /TRUSTED_PROXY_CIDRS_REQUIRED/,
  );
});

test("rate limit capacity is bounded and expired entries are removed", () => {
  let now = 0;
  const limiter = createRateLimiter({
    capacity: 2,
    windowMs: 1000,
    now: () => now,
  });
  limiter.hit("a", "contact");
  limiter.hit("b", "contact");
  assert.throws(() => limiter.hit("c", "contact"), { status: 429 });
  assert.equal(limiter.size, 2);
  now = 1001;
  limiter.hit("c", "contact");
  assert.equal(limiter.size, 1);
});

test("receipts and private fingerprints survive restart; unfinished delivery becomes unknown", () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "aihub-contact-restart-"),
  );
  const filename = path.join(directory, "receipts.sqlite");
  try {
    const submissionKey = key();
    let store = new ContactReceipts(filename);
    const first = store.reserve(submissionKey, contact());
    store.setChannel(first.id, "mail", "done");
    store.setChannel(first.id, "sheet", "sending");
    store.close();
    store = new ContactReceipts(filename);
    const recovered = store.find(submissionKey, contact());
    assert.equal(recovered.mail_state, "done");
    assert.equal(recovered.sheet_state, "unknown");
    assert.equal(store.reserve(key(), contact()).id, first.id);
    assert.equal(fs.statSync(`${filename}.key`).mode & 0o777, 0o600);
    store.close();
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("contact content deduplication expires at ten minutes and receipts at 24 hours", () => {
  let now = 1000;
  const store = new ContactReceipts(":memory:", { now: () => now });
  try {
    const submissionKey = key();
    const first = store.reserve(submissionKey, contact());
    now += 599999;
    assert.equal(store.reserve(key(), contact()).id, first.id);
    now += 2;
    assert.notEqual(store.reserve(key(), contact()).id, first.id);
    now += 86400000;
    store.prune();
    assert.equal(store.find(submissionKey, contact()), undefined);
    assert.equal(
      store.db.prepare("SELECT count(*) AS n FROM receipt_keys").get().n,
      0,
    );
  } finally {
    store.close();
  }
});

test("production rejects official dummy secrets and missing required configuration", () => {
  assert.throws(
    () =>
      createBotCheck({
        production: true,
        secretKey: "1x0000000000000000000000000000000AA",
        hostnames: ["aihub.works"],
      }),
    /TEST_CONFIG/,
  );
  assert.throws(() => createBotCheck({ required: true }), /CONFIG_REQUIRED/);
});

test("restarted contact service replays completed receipts and blocks unknown delivery", async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "aihub-contact-service-restart-"),
  );
  const filename = path.join(directory, "receipts.sqlite");
  let sends = 0;
  const security = createFormSecurity();
  const completedKey = key();
  const unknownKey = key();
  const lead = contact();
  let store = new ContactReceipts(filename);
  const makeService = () =>
    createContactService({
      security,
      receipts: store,
      sendEmail: async () => {
        sends++;
      },
      appendSheet: async () => {
        sends++;
      },
      log: () => {},
    });
  let service = makeService();
  const request = (id) => ({ headers: { "idempotency-key": id } });
  try {
    await service.submit(request(completedKey), lead);
    const unknownLead = { ...lead, name: "Another Buyer" };
    const unknown = store.reserve(unknownKey, unknownLead);
    store.setChannel(unknown.id, "mail", "done");
    store.setChannel(unknown.id, "sheet", "sending");
    service.close();
    store.close();
    store = new ContactReceipts(filename);
    service = makeService();
    assert.equal((await service.submit(request(completedKey), lead)).ok, true);
    await assert.rejects(service.submit(request(unknownKey), unknownLead), {
      status: 503,
      code: "CONTACT_DELIVERY_UNKNOWN",
    });
    assert.equal(sends, 2);
  } finally {
    service.close();
    store.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("verification-only CLI never succeeds without configured keys and a nonempty token", () => {
  const script = fileURLToPath(new URL("../forms/verify.js", import.meta.url));
  for (const secret of ["", "test-config-for-empty-input"]) {
    const result = spawnSync(process.execPath, [script, "contact_submit"], {
      input: "",
      encoding: "utf8",
      env: {
        ...process.env,
        TURNSTILE_ENFORCE: "false",
        TURNSTILE_SECRET_KEY: secret,
        TURNSTILE_ALLOWED_HOSTNAMES: "aihub.works",
      },
    });
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      secret ? /BOT_CHECK_FAILED/ : /CONFIGURATION_ERROR/,
    );
    assert.doesNotMatch(result.stderr, /test-config-for-empty-input/);
  }
});

test("graceful contact shutdown waits for in-flight delivery receipts", async () => {
  const store = new ContactReceipts();
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const service = createContactService({
    security: createFormSecurity(),
    receipts: store,
    sendEmail: async () => gate,
    appendSheet: async () => {},
    log: () => {},
  });
  const submissionKey = key();
  const request = { headers: { "idempotency-key": submissionKey } };
  const pending = service.submit(request, contact());
  await Promise.resolve();
  let stopped = false;
  const shutdown = service.close().then(() => {
    stopped = true;
  });
  await Promise.resolve();
  assert.equal(stopped, false);
  await assert.rejects(service.submit(request, contact()), {
    code: "CONTACT_UNAVAILABLE",
  });
  release();
  await pending;
  await shutdown;
  assert.equal(store.complete(store.find(submissionKey, contact())), true);
  store.close();
});

test("shop SMTP uncertainty is held for review without resending the successful notification", async (t) => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "aihub-shop-unknown-"),
  );
  let now = Date.now();
  const attempts = [];
  const shop = createShopService({
    filename: path.join(directory, "shop.sqlite"),
    origins: [],
    from: "sender@example.test",
    now: () => now,
    sendMail: async (mail) => {
      attempts.push(mail.to);
      if (mail.to === "sales@aihubworks.com")
        throw Object.assign(new Error("test-only lost acknowledgement"), {
          code: "ETIMEDOUT",
        });
    },
    log: () => {},
  });
  t.after(async () => {
    await shop.stop();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const { validateSubmission } = await import("../shop/contract.js");
  shop.store.create(key(), validateSubmission(shopPayload()));
  await shop.drain();
  assert.equal(attempts.length, 2);
  assert.equal(
    shop.store.db
      .prepare(
        "SELECT count(*) AS n FROM outbox WHERE state='failed' AND last_error='DELIVERY_UNKNOWN'",
      )
      .get().n,
    1,
  );
  now += 86400000;
  await shop.drain();
  assert.equal(attempts.length, 2);
});
