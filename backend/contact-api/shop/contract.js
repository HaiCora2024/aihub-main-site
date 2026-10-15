import fs from "node:fs";
import { createHash } from "node:crypto";

const readShared = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`../shared/${name}.json`, import.meta.url), "utf8"),
  );
export const catalog = readShared("catalog");
export const legal = readShared("legal");
export const seller = readShared("seller");
export const countries = readShared("countries");
export const KEY_PATTERN = /^[a-f0-9]{64}$/;
export const hash = (value) => createHash("sha256").update(value).digest("hex");

export class ShopError extends Error {
  constructor(status, code, fields = {}) {
    super(code);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const publicCatalog = () => ({
  ...catalog,
  legal,
  mode: "request",
  vatStatus: "pending_review",
});

export function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new ShopError(400, "VALIDATION_ERROR");
  const errors = {};
  const string = (value, field, max, required = true) => {
    if (typeof value !== "string") {
      if (required || value != null) errors[field] = "required";
      return "";
    }
    const clean = value.trim();
    if (
      (required && !clean) ||
      clean.length > max ||
      /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(clean)
    )
      errors[field] = "invalid";
    return clean;
  };
  if (body.website) throw new ShopError(400, "SUBMISSION_REJECTED");
  const customer = body.customer || {};
  const billing = body.billing || {};
  const clean = {
    locale: body.locale,
    customer: {
      name: string(customer.name, "name", 120),
      email: string(customer.email, "email", 160).toLowerCase(),
      phone: string(customer.phone, "phone", 60, false),
    },
    billing: {
      type: billing.type,
      country: string(billing.country, "country", 2),
      address: string(billing.address, "address", 240),
      addressLine2: string(billing.addressLine2, "addressLine2", 160, false),
      city: string(billing.city, "city", 120),
      region: string(billing.region, "region", 120, false),
      postalCode: string(
        billing.postalCode,
        "postalCode",
        24,
        !countries.postalOptional.includes(billing.country),
      ),
      companyName:
        billing.type === "business"
          ? string(billing.companyName, "companyName", 200)
          : "",
      registrationNumber:
        billing.type === "business"
          ? string(billing.registrationNumber, "registrationNumber", 80, false)
          : "",
      vatRegistered:
        billing.type === "business" ? billing.vatRegistered : false,
      vatId:
        billing.type === "business" && billing.vatRegistered === true
          ? string(billing.vatId, "vatId", 32).replace(/\s+/g, "").toUpperCase()
          : "",
    },
    comment: string(body.comment, "comment", 2000, false),
    catalogVersion: string(body.catalogVersion, "catalogVersion", 80),
    termsVersion: string(body.termsVersion, "termsVersion", 80),
    privacyVersion: string(body.privacyVersion, "privacyVersion", 80),
    termsAccepted: body.termsAccepted === true,
    items: [],
  };
  if (!["ru", "en"].includes(clean.locale)) errors.locale = "invalid";
  if (
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
      clean.customer.email,
    ) ||
    /(^\.|\.\.|\.@)/.test(clean.customer.email) ||
    /[\r\n]/.test(
      clean.customer.name + clean.customer.email + clean.customer.phone,
    )
  )
    errors.email = "invalid";
  if (clean.customer.name.length < 2) errors.name = "invalid";
  if (!["individual", "business"].includes(clean.billing.type))
    errors.type = "required";
  if (!countries.codes.includes(clean.billing.country))
    errors.country = "invalid";
  if (
    clean.billing.type === "business" &&
    typeof billing.vatRegistered !== "boolean"
  )
    errors.vatRegistered = "required";
  if (clean.billing.vatId && !/^[A-Z0-9.-]{3,32}$/.test(clean.billing.vatId))
    errors.vatId = "invalid";
  if (!clean.termsAccepted) errors.termsAccepted = "required";
  if (
    !Array.isArray(body.items) ||
    !body.items.length ||
    body.items.length > catalog.products.length
  )
    errors.items = "invalid";
  else {
    const seen = new Set();
    for (const item of body.items) {
      if (
        !item ||
        !Number.isSafeInteger(item.id) ||
        !catalog.products.some((p) => p.id === item.id) ||
        !Number.isSafeInteger(item.qty) ||
        item.qty < 1 ||
        item.qty > 99 ||
        seen.has(item.id)
      ) {
        errors.items = "invalid";
        continue;
      }
      seen.add(item.id);
      clean.items.push({ id: item.id, qty: item.qty });
    }
    clean.items.sort((a, b) => a.id - b.id);
  }
  if (Object.keys(errors).length)
    throw new ShopError(400, "VALIDATION_ERROR", errors);
  return clean;
}

export function checkVersions(body) {
  if (
    body.termsVersion !== legal.termsVersion ||
    body.privacyVersion !== legal.privacyVersion
  )
    throw new ShopError(409, "LEGAL_CHANGED");
  if (body.catalogVersion !== catalog.version)
    throw new ShopError(409, "CATALOG_CHANGED");
}

export function priceItems(items) {
  return items.map((item) => {
    const p = catalog.products.find((product) => product.id === item.id);
    return {
      ...item,
      name: p.name,
      unit: p.unit,
      unitPriceMinor: p.unitPriceMinor,
    };
  });
}
