import { BlockList, isIP } from "node:net";
import { createHmac, randomBytes } from "node:crypto";

export class FormError extends Error {
  constructor(status, code, retryAfter) {
    super(code);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

function normalizeIp(value) {
  if (typeof value !== "string" || value.includes("%") || !isIP(value))
    return null;
  let ip = value.toLowerCase();
  if (isIP(ip) === 6) {
    ip = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
    const mapped = /^::ffff:([a-f0-9]+):([a-f0-9]+)$/.exec(ip);
    if (mapped) {
      const high = parseInt(mapped[1], 16);
      const low = parseInt(mapped[2], 16);
      return [high >> 8, high & 255, low >> 8, low & 255].join(".");
    }
  }
  return ip;
}

export function createIpResolver({
  trustedProxyHops = 0,
  trustedProxyCidrs = [],
} = {}) {
  if (
    !Number.isInteger(trustedProxyHops) ||
    trustedProxyHops < 0 ||
    trustedProxyHops > 8
  )
    throw new Error("INVALID_TRUSTED_PROXY_HOPS");
  const proxies = new BlockList();
  for (const cidr of trustedProxyCidrs) {
    const [address, prefix, extra] = cidr.split("/");
    const family = isIP(address);
    const bits =
      prefix === undefined ? (family === 4 ? 32 : 128) : Number(prefix);
    if (
      !family ||
      extra !== undefined ||
      (prefix !== undefined && !/^\d{1,3}$/.test(prefix)) ||
      !Number.isInteger(bits) ||
      bits < 0 ||
      bits > (family === 4 ? 32 : 128)
    )
      throw new Error("INVALID_TRUSTED_PROXY_CIDR");
    proxies.addSubnet(address, bits, family === 4 ? "ipv4" : "ipv6");
  }
  if (trustedProxyHops && !trustedProxyCidrs.length)
    throw new Error("TRUSTED_PROXY_CIDRS_REQUIRED");
  const trusted = (ip) =>
    ip && proxies.check(ip, isIP(ip) === 4 ? "ipv4" : "ipv6");
  return (req) => {
    const peer = normalizeIp(req.socket.remoteAddress) || "unknown";
    if (!trustedProxyHops || !trusted(peer)) return peer;
    const header = req.headers["x-forwarded-for"];
    if (typeof header !== "string" || header.length > 4096) return peer;
    const chain = header.split(",").map((ip) => normalizeIp(ip.trim()));
    if (chain.length > 16 || chain.length < trustedProxyHops) return peer;
    for (let offset = 1; offset < trustedProxyHops; offset++)
      if (!trusted(chain[chain.length - offset])) return peer;
    return chain[chain.length - trustedProxyHops] || peer;
  };
}

export function createRateLimiter({
  now = Date.now,
  windowMs = 900000,
  capacity = 10000,
} = {}) {
  if (
    !Number.isSafeInteger(windowMs) ||
    windowMs < 1 ||
    !Number.isSafeInteger(capacity) ||
    capacity < 1
  )
    throw new Error("INVALID_RATE_LIMIT_CONFIG");
  const records = new Map();
  const salt = randomBytes(32);
  let nextCleanup = 0;
  const cleanup = (time) => {
    for (const [key, record] of records)
      if (record.reset <= time) records.delete(key);
    nextCleanup = time + Math.min(15000, windowMs);
  };
  return {
    get size() {
      return records.size;
    },
    hit(ip, group, limit = 5) {
      if (!Number.isSafeInteger(limit) || limit < 1)
        throw new Error("INVALID_RATE_LIMIT");
      const time = now();
      if (time >= nextCleanup || records.size >= capacity) cleanup(time);
      const key = createHmac("sha256", salt)
        .update(`${group}:${ip}`)
        .digest("hex");
      const current = records.get(key);
      if (!current && records.size >= capacity)
        throw new FormError(429, "RATE_LIMITED", Math.ceil(windowMs / 1000));
      const record = current || { count: 0, reset: time + windowMs };
      record.count++;
      records.set(key, record);
      if (record.count > limit)
        throw new FormError(
          429,
          "RATE_LIMITED",
          Math.max(1, Math.ceil((record.reset - time) / 1000)),
        );
    },
  };
}

const TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
]);

export function createBotCheck({
  required = false,
  secretKey = "",
  hostnames = [],
  production = process.env.NODE_ENV === "production",
  fetchImpl = globalThis.fetch,
  timeoutMs = 5000,
} = {}) {
  const hosts = new Set(hostnames.map((host) => host.toLowerCase()));
  if (required && (!secretKey || !hosts.size))
    throw new Error("TURNSTILE_CONFIG_REQUIRED");
  if (
    production &&
    (TEST_SECRETS.has(secretKey) ||
      [...hosts].some((host) => host === "localhost" || isIP(host)))
  )
    throw new Error("TURNSTILE_TEST_CONFIG_IN_PRODUCTION");
  if ([...hosts].some((host) => !/^[a-z0-9.-]+$/.test(host)))
    throw new Error("INVALID_TURNSTILE_HOSTNAME");
  return {
    required,
    async verify(token, action) {
      if (!required && !token) return;
      if (typeof token !== "string" || !token.trim() || token.length > 2048)
        throw new FormError(403, "BOT_CHECK_FAILED");
      if (!secretKey || !hosts.size)
        throw new FormError(503, "BOT_CHECK_UNAVAILABLE");
      const controller = new AbortController();
      let timer;
      try {
        const deadline = new Promise((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new FormError(503, "BOT_CHECK_UNAVAILABLE"));
          }, timeoutMs);
        });
        const validation = (async () => {
          const response = await fetchImpl(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ secret: secretKey, response: token }),
              signal: controller.signal,
            },
          );
          if (!response.ok) throw new FormError(503, "BOT_CHECK_UNAVAILABLE");
          return response.json();
        })();
        const result = await Promise.race([validation, deadline]);
        if (result?.success === false) {
          if (result["error-codes"]?.includes("internal-error"))
            throw new FormError(503, "BOT_CHECK_UNAVAILABLE");
          throw new FormError(403, "BOT_CHECK_FAILED");
        }
        if (result?.success !== true)
          throw new FormError(503, "BOT_CHECK_UNAVAILABLE");
        if (!hosts.has(result.hostname) || result.action !== action)
          throw new FormError(403, "BOT_CHECK_FAILED");
      } catch (error) {
        if (error instanceof FormError) throw error;
        throw new FormError(503, "BOT_CHECK_UNAVAILABLE");
      } finally {
        clearTimeout(timer);
      }
    },
  };
}

export function createFormSecurity({
  trustedProxyHops = 0,
  trustedProxyCidrs = [],
  now,
  rateWindowMs,
  rateCapacity,
  ...botOptions
} = {}) {
  return {
    resolveIp: createIpResolver({ trustedProxyHops, trustedProxyCidrs }),
    limiter: createRateLimiter({
      now,
      windowMs: rateWindowMs,
      capacity: rateCapacity,
    }),
    bot: createBotCheck(botOptions),
  };
}

export function formSecurityFromEnv() {
  return createFormSecurity({
    required: process.env.TURNSTILE_ENFORCE === "true",
    secretKey: process.env.TURNSTILE_SECRET_KEY || "",
    hostnames: (process.env.TURNSTILE_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
    trustedProxyHops: Number(process.env.FORMS_TRUST_PROXY_HOPS || 0),
    trustedProxyCidrs: (process.env.FORMS_TRUST_PROXY_CIDRS || "")
      .split(",")
      .map((cidr) => cidr.trim())
      .filter(Boolean),
    rateWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  });
}
