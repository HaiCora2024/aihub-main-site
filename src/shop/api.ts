import type { Receipt, ShopCatalog, Submission } from "./contracts";

const configured = (import.meta.env.VITE_SHOP_API_URL || "").replace(
  /\/+$/,
  "",
);
export const shopApiConfigured =
  /^https:\/\//.test(configured) ||
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(configured);

export class ShopApiError extends Error {
  constructor(
    public code: string,
    public status = 0,
    public fields: Record<string, string> = {},
  ) {
    super(code);
  }
}

async function request(
  path: string,
  init: RequestInit = {},
): Promise<Record<string, unknown>> {
  if (!shopApiConfigured) throw new ShopApiError("SHOP_UNAVAILABLE");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${configured}/api/shop/${path}`, {
      ...init,
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok)
      throw new ShopApiError(
        typeof body?.error?.code === "string"
          ? body.error.code
          : "SHOP_UNAVAILABLE",
        response.status,
        body?.error?.fields && typeof body.error.fields === "object"
          ? body.error.fields
          : {},
      );
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new ShopApiError("INVALID_RESPONSE");
    return body;
  } catch (e) {
    if (e instanceof ShopApiError) throw e;
    throw new ShopApiError("NETWORK_UNKNOWN");
  } finally {
    clearTimeout(timeout);
  }
}

export async function loadCatalog(): Promise<ShopCatalog> {
  const data = await request("catalog");
  const c = data as unknown as ShopCatalog;
  if (
    typeof c.version !== "string" ||
    c.currency !== "EUR" ||
    !c.legal ||
    typeof c.legal.termsVersion !== "string" ||
    typeof c.legal.privacyVersion !== "string" ||
    typeof c.legal.effectiveDate !== "string" ||
    !Array.isArray(c.products) ||
    c.products.length < 1 ||
    c.products.length > 100 ||
    c.products.some(
      (p) =>
        !p ||
        !Number.isSafeInteger(p.id) ||
        typeof p.slug !== "string" ||
        !Array.isArray(p.packages) ||
        !p.packages.length ||
        p.packages.some(
          (pkg) =>
            !pkg ||
            typeof pkg.id !== "string" ||
            !Number.isSafeInteger(pkg.priceMinor) ||
            pkg.priceMinor < 0 ||
            typeof pkg.openEnded !== "boolean" ||
            typeof pkg.name?.en !== "string" ||
            typeof pkg.name?.ru !== "string",
        ) ||
        !["setup", "session"].includes(p.unit) ||
        typeof p.name?.en !== "string" ||
        typeof p.name?.ru !== "string",
    ) ||
    new Set(c.products.map((p) => p.id)).size !== c.products.length
  )
    throw new ShopApiError("INVALID_RESPONSE");
  return c;
}

function receipt(data: Record<string, unknown>): Receipt {
  const r = data.request as Receipt;
  if (
    !r ||
    !/^REQ-[A-F0-9-]{36}$/.test(r.id) ||
    !Number.isFinite(Date.parse(r.createdAt)) ||
    r.status !== "received" ||
    r.mode !== "request" ||
    r.currency !== "EUR" ||
    !Number.isSafeInteger(r.estimatedTotalMinor) ||
    r.estimatedTotalMinor < 0 ||
    r.vatStatus !== "pending_review"
  )
    throw new ShopApiError("INVALID_RESPONSE");
  return {
    id: r.id,
    createdAt: r.createdAt,
    status: r.status,
    mode: r.mode,
    currency: r.currency,
    estimatedTotalMinor: r.estimatedTotalMinor,
    vatStatus: r.vatStatus,
  };
}

export const submitRequest = async (body: Submission, key: string) =>
  receipt(
    await request("requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify(body),
    }),
  );
export const recoverRequest = async (key: string) =>
  receipt(
    await request("requests/status", {
      headers: { Authorization: `Bearer ${key}` },
    }),
  );
export const newSubmissionKey = () =>
  [...crypto.getRandomValues(new Uint8Array(32))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
