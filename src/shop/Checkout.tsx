import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button, PageContainer, TextField } from "../design-system";
import { SiteHeader } from "../components/SiteHeader";
import { CompanyDetails } from "../components/CompanyDetails";
import countryData from "../../backend/contact-api/shared/countries.json";
import documentVersions from "../../backend/contact-api/shared/legal.json";
import seller from "../../backend/contact-api/shared/seller.json";
import { CART_KEY, readCart } from "./cart";
import { productIcon, products } from "./data";
import {
  loadCatalog,
  newSubmissionKey,
  recoverRequest,
  ShopApiError,
  submitRequest,
} from "./api";
import { consumeSubmittedCart, readPending, writePending } from "./submission";
import type { PendingSubmission } from "./submission";
import type {
  Billing,
  Language,
  Receipt,
  ShopCatalog,
  Submission,
} from "./contracts";
import { checkoutCopy } from "./checkout-copy";

const base = import.meta.env.BASE_URL;
const initialBilling: Billing = {
  type: "individual",
  country: "",
  address: "",
  addressLine2: "",
  city: "",
  region: "",
  postalCode: "",
  companyName: "",
  registrationNumber: "",
  vatRegistered: false,
  vatId: "",
};

export default function Checkout() {
  const [lang, setLang] = useState<Language>(() =>
    new URLSearchParams(location.search).get("lang") === "ru" ? "ru" : "en",
  );
  const t = checkoutCopy[lang];
  const [pending, setPending] = useState(readPending);
  const pendingRef = useRef(pending);
  const [cart, setCart] = useState(() => pending?.items || readCart());
  const [catalog, setCatalog] = useState<ShopCatalog | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uncertain, setUncertain] = useState(!!pending);
  const [notice, setNotice] = useState<keyof typeof t | "">(
    pending ? "resume" : "",
  );
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const frozen = useRef<Submission | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const actionLock = useRef(false);
  const generation = useRef(0);
  const policyMismatch =
    !!catalog &&
    (catalog.legal.termsVersion !== documentVersions.termsVersion ||
      catalog.legal.privacyVersion !== documentVersions.privacyVersion);
  const fieldError = (name: string) =>
    fields[name]
      ? name === "termsAccepted"
        ? t.acceptTerms
        : name === "email"
          ? t.invalidEmail
          : fields[name] === "required"
            ? t.required
            : t.invalid
      : undefined;
  const countryNames = new Intl.DisplayNames([lang], { type: "region" });
  const countries = countryData.codes
    .map((code) => ({ code, name: countryNames.of(code) || code }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));
  const price = (minor: number) =>
    new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-US", {
      style: "currency",
      currency: "EUR",
    }).format(minor / 100);
  const estimate = cart.reduce(
    (sum, item) =>
      sum +
      item.qty *
        (catalog?.products.find((p) => p.id === item.id)?.unitPriceMinor || 0),
    0,
  );
  const missingProduct =
    !!catalog &&
    cart.some((item) => !catalog.products.some((p) => p.id === item.id));
  const locked = busy || (uncertain && !!frozen.current);

  function remember(value: PendingSubmission | null) {
    pendingRef.current = value;
    setPending(value);
    writePending(value);
  }
  async function refreshCatalog() {
    const version = ++generation.current;
    setCatalogLoading(true);
    try {
      const data = await loadCatalog();
      if (version === generation.current) setCatalog(data);
    } catch {
      if (version === generation.current) setCatalog(null);
    } finally {
      if (version === generation.current) setCatalogLoading(false);
    }
  }
  async function accepted(result: Receipt, snapshot: PendingSubmission) {
    await consumeSubmittedCart(snapshot.items, result.id);
    remember(null);
    frozen.current = null;
    setUncertain(false);
    setReceipt(result);
    setNotice("");
    setCustomer({ name: "", email: "", phone: "" });
    setBilling(initialBilling);
    setComment("");
  }
  async function checkStatus() {
    const snapshot = pendingRef.current;
    if (!snapshot || actionLock.current) return;
    actionLock.current = true;
    setBusy(true);
    try {
      await accepted(await recoverRequest(snapshot.key), snapshot);
    } catch (error) {
      if (error instanceof ShopApiError && error.code === "REQUEST_NOT_FOUND") {
        setNotice(frozen.current ? "notFound" : "recoverForm");
        setUncertain(!!frozen.current);
      } else if (
        error instanceof ShopApiError &&
        error.code === "REQUEST_DELETED"
      ) {
        remember(null);
        frozen.current = null;
        setUncertain(false);
        setNotice("deleted");
      } else {
        setNotice("unknown");
        setUncertain(true);
      }
    } finally {
      setBusy(false);
      actionLock.current = false;
    }
  }

  useEffect(() => {
    void refreshCatalog();
    void checkStatus();
    return () => {
      generation.current++;
    };
    // Initial recovery deliberately uses the tab-scoped key, not customer form state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "ru"
        ? "Заявка на AI-решения | AIHUB"
        : "Request an AI solution | AIHUB";
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (
        (event.key === CART_KEY || event.key === null) &&
        !pendingRef.current &&
        !actionLock.current &&
        !receipt
      ) {
        setCart(readCart());
        setTermsAccepted(false);
        setNotice("cartChanged");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [receipt]);
  useEffect(() => {
    if (receipt) successHeading.current?.focus();
  }, [receipt]);

  function validate() {
    const errors: Record<string, string> = {};
    for (const [name, value] of Object.entries({
      name: customer.name,
      email: customer.email,
      country: billing.country,
      address: billing.address,
      city: billing.city,
    }))
      if (!value.trim()) errors[name] = "required";
    if (customer.name.trim().length < 2) errors.name = "invalid";
    if (
      !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
        customer.email.trim(),
      ) ||
      /(^\.|\.\.|\.@)/.test(customer.email.trim())
    )
      errors.email = "invalid";
    if (
      !countryData.postalOptional.includes(billing.country) &&
      !billing.postalCode.trim()
    )
      errors.postalCode = "required";
    if (billing.type === "business" && !billing.companyName.trim())
      errors.companyName = "required";
    if (
      billing.type === "business" &&
      billing.vatRegistered &&
      !billing.vatId.trim()
    )
      errors.vatId = "required";
    if (!termsAccepted) errors.termsAccepted = "required";
    setFields(errors);
    if (Object.keys(errors).length) {
      const first = Object.keys(errors)[0];
      requestAnimationFrame(() =>
        form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus(),
      );
      return false;
    }
    return true;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (
      actionLock.current ||
      !catalog ||
      policyMismatch ||
      !cart.length ||
      missingProduct
    )
      return;
    if (!frozen.current && !validate()) return;
    const snapshot = pendingRef.current || {
      key: newSubmissionKey(),
      items: cart.map((i) => ({ ...i })),
      createdAt: Date.now(),
    };
    const body: Submission = frozen.current || {
      customer,
      billing,
      comment,
      website,
      locale: lang,
      items: snapshot.items,
      catalogVersion: catalog.version,
      termsVersion: catalog.legal.termsVersion,
      privacyVersion: catalog.legal.privacyVersion,
      termsAccepted,
    };
    frozen.current = structuredClone(body);
    remember(snapshot);
    actionLock.current = true;
    setBusy(true);
    setNotice("");
    try {
      if (uncertain) {
        try {
          await accepted(await recoverRequest(snapshot.key), snapshot);
          return;
        } catch (error) {
          if (
            !(
              error instanceof ShopApiError &&
              error.code === "REQUEST_NOT_FOUND"
            )
          )
            throw error;
        }
      }
      await accepted(await submitRequest(body, snapshot.key), snapshot);
    } catch (error) {
      const e =
        error instanceof ShopApiError
          ? error
          : new ShopApiError("NETWORK_UNKNOWN");
      if (e.code === "REQUEST_DELETED") {
        remember(null);
        frozen.current = null;
        setUncertain(false);
        setNotice("deleted");
      } else if (["CATALOG_CHANGED", "LEGAL_CHANGED"].includes(e.code)) {
        remember(null);
        frozen.current = null;
        setUncertain(false);
        setTermsAccepted(false);
        setNotice("changed");
        await refreshCatalog();
      } else if (e.code === "IDEMPOTENCY_CONFLICT") {
        try {
          await accepted(await recoverRequest(snapshot.key), snapshot);
        } catch {
          setUncertain(true);
          setNotice("unknown");
        }
      } else if (e.status === 400 || e.status === 413 || e.status === 415) {
        remember(null);
        frozen.current = null;
        setUncertain(false);
        setFields(e.fields);
        setNotice("error");
        const first = Object.keys(e.fields)[0];
        requestAnimationFrame(() =>
          form.current
            ?.querySelector<HTMLElement>(
              `[name="${CSS.escape(first || "name")}"]`,
            )
            ?.focus(),
        );
      } else {
        setUncertain(true);
        setNotice(e.status === 429 ? "rate" : "unknown");
      }
    } finally {
      actionLock.current = false;
      setBusy(false);
    }
  }

  const legalLink = (kind: "terms" | "privacy-policy") =>
    `${base}legal/${kind}.html?lang=${lang}`;
  const field = (
    name: keyof Billing,
    label: string,
    required = false,
    autoComplete?: string,
    maxLength = 160,
  ) => (
    <TextField
      name={name}
      label={label}
      value={String(billing[name])}
      onChange={(e) => setBilling({ ...billing, [name]: e.target.value })}
      required={required}
      maxLength={maxLength}
      autoComplete={autoComplete}
      error={fieldError(name)}
    />
  );

  return (
    <div className="aihub-theme checkout-page">
      <a className="checkout-skip" href="#checkout-main">
        {lang === "ru" ? "К оформлению заявки" : "Skip to request"}
      </a>
      <SiteHeader
        lang={lang}
        onLanguageChange={() => setLang(lang === "en" ? "ru" : "en")}
        page="shop"
      />
      <PageContainer>
        <main id="checkout-main">
          <a className="checkout-back" href={`${base}shop.html?lang=${lang}`}>
            ← {t.back}
          </a>
          {receipt ? (
            <section className="checkout-success" aria-live="polite">
              <span className="checkout-success-icon" aria-hidden="true">
                ✓
              </span>
              <h1 ref={successHeading} tabIndex={-1}>
                {t.successTitle}
              </h1>
              <p>{t.successText}</p>
              <div className="checkout-reference">
                <span>{t.reference}</span>
                <strong>{receipt.id}</strong>
              </div>
              <p>
                {t.estimate}:{" "}
                <strong>{price(receipt.estimatedTotalMinor)}</strong>
                <br />
                {t.vat}
              </p>
              <Button href={`${base}shop.html?lang=${lang}`}>{t.next}</Button>
              <a href={`mailto:${seller.salesEmail}`}>
                {t.support}: {seller.salesEmail}
              </a>
            </section>
          ) : (
            <>
              <header className="checkout-heading">
                <h1>{t.title}</h1>
                <p>{t.subtitle}</p>
              </header>
              {notice && (
                <div className="checkout-notice" role="status">
                  {t[notice]}{" "}
                  {pending && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void checkStatus()}
                    >
                      {t.checkStatus}
                    </button>
                  )}
                </div>
              )}
              {!cart.length ? (
                <section className="checkout-empty">
                  <h2>{t.empty}</h2>
                  <Button href={`${base}shop.html?lang=${lang}`}>
                    {t.back}
                  </Button>
                </section>
              ) : (
                <div className="checkout-grid">
                  <form
                    ref={form}
                    onSubmit={submit}
                    noValidate
                    className="checkout-form"
                    aria-busy={busy}
                  >
                    <fieldset disabled={locked}>
                      <legend>{t.contact}</legend>
                      <div className="checkout-fields">
                        <TextField
                          label={t.name}
                          name="name"
                          autoComplete="name"
                          maxLength={120}
                          required
                          value={customer.name}
                          onChange={(e) =>
                            setCustomer({ ...customer, name: e.target.value })
                          }
                          error={fieldError("name")}
                        />
                        <TextField
                          label={t.email}
                          name="email"
                          type="email"
                          autoComplete="email"
                          maxLength={160}
                          required
                          value={customer.email}
                          onChange={(e) =>
                            setCustomer({ ...customer, email: e.target.value })
                          }
                          error={fieldError("email")}
                        />
                        <TextField
                          label={t.phone}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          maxLength={60}
                          value={customer.phone}
                          onChange={(e) =>
                            setCustomer({ ...customer, phone: e.target.value })
                          }
                          error={fieldError("phone")}
                        />
                      </div>
                    </fieldset>
                    <fieldset disabled={locked}>
                      <legend>{t.billing}</legend>
                      <div
                        className="checkout-segments"
                        role="group"
                        aria-label={t.billing}
                      >
                        {(["individual", "business"] as const).map((type) => (
                          <label key={type}>
                            <input
                              type="radio"
                              name="type"
                              value={type}
                              checked={billing.type === type}
                              onChange={() =>
                                setBilling({
                                  ...billing,
                                  type,
                                  companyName: "",
                                  registrationNumber: "",
                                  vatRegistered: false,
                                  vatId: "",
                                })
                              }
                            />
                            <span>{t[type]}</span>
                          </label>
                        ))}
                      </div>
                      <div className="checkout-fields">
                        {billing.type === "business" && (
                          <>
                            {field(
                              "companyName",
                              t.companyName,
                              true,
                              "organization",
                              200,
                            )}
                            {field(
                              "registrationNumber",
                              t.registrationNumber,
                              false,
                              "off",
                              80,
                            )}
                          </>
                        )}
                        <div
                          className="aihub-field"
                          data-tone={fields.country ? "red" : "blue"}
                        >
                          <label htmlFor="billing-country">
                            {t.country} <span aria-hidden="true">*</span>
                          </label>
                          <select
                            id="billing-country"
                            name="country"
                            autoComplete="billing country"
                            required
                            value={billing.country}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                country: e.target.value,
                              })
                            }
                            aria-invalid={!!fields.country}
                            aria-describedby={
                              fields.country ? "country-error" : undefined
                            }
                          >
                            <option value="">{t.choose}</option>
                            {countries.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          {fields.country && (
                            <span
                              className="aihub-field-error"
                              id="country-error"
                            >
                              {fieldError("country")}
                            </span>
                          )}
                        </div>
                        {field(
                          "address",
                          t.address,
                          true,
                          "billing address-line1",
                          240,
                        )}
                        {field(
                          "addressLine2",
                          t.addressLine2,
                          false,
                          "billing address-line2",
                        )}
                        {field(
                          "city",
                          t.city,
                          true,
                          "billing address-level2",
                          120,
                        )}
                        {field(
                          "region",
                          t.region,
                          false,
                          "billing address-level1",
                          120,
                        )}
                        {field(
                          "postalCode",
                          countryData.postalOptional.includes(billing.country)
                            ? t.postalOptional
                            : t.postalCode,
                          !countryData.postalOptional.includes(billing.country),
                          "billing postal-code",
                          24,
                        )}
                      </div>
                      {billing.type === "business" && (
                        <div className="checkout-vat">
                          <span>{t.vatRegistered}</span>
                          <div
                            className="checkout-segments"
                            role="group"
                            aria-label={t.vatRegistered}
                          >
                            {[true, false].map((value) => (
                              <label key={String(value)}>
                                <input
                                  type="radio"
                                  name="vatRegistered"
                                  value={String(value)}
                                  checked={billing.vatRegistered === value}
                                  onChange={() =>
                                    setBilling({
                                      ...billing,
                                      vatRegistered: value,
                                      vatId: "",
                                    })
                                  }
                                />
                                <span>{value ? t.vatYes : t.vatNo}</span>
                              </label>
                            ))}
                          </div>
                          {billing.vatRegistered &&
                            field("vatId", t.vatId, true, "off", 32)}
                          <p>{t.vatHint}</p>
                        </div>
                      )}
                      <div className="aihub-field checkout-comment">
                        <label htmlFor="project-comment">{t.comment}</label>
                        <textarea
                          id="project-comment"
                          name="comment"
                          maxLength={2000}
                          rows={4}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                    </fieldset>
                    <div className="checkout-honeypot" aria-hidden="true">
                      <label>
                        Website
                        <input
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="checkout-consents">
                      <label className="checkout-checkbox">
                        <input
                          type="checkbox"
                          name="termsAccepted"
                          required
                          checked={termsAccepted}
                          disabled={locked}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          aria-invalid={!!fields.termsAccepted}
                          aria-describedby={
                            fields.termsAccepted ? "terms-error" : undefined
                          }
                        />
                        <span>
                          {t.termsBefore}{" "}
                          <a
                            href={legalLink("terms")}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t.termsLink}
                          </a>{" "}
                          {t.termsAfter}
                        </span>
                      </label>
                      {fields.termsAccepted && (
                        <p className="checkout-error" id="terms-error">
                          {fieldError("termsAccepted")}
                        </p>
                      )}
                      <p>
                        {t.privacyBefore}{" "}
                        <a
                          href={legalLink("privacy-policy")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t.privacyLink}
                        </a>
                        {t.privacyAfter}
                      </p>
                    </div>
                    {catalogLoading ? (
                      <p role="status">{t.loading}</p>
                    ) : !catalog || missingProduct ? (
                      <div className="checkout-error" role="alert">
                        {t.unavailable}
                        <button
                          type="button"
                          onClick={() => void refreshCatalog()}
                        >
                          {t.reloadCatalog}
                        </button>
                      </div>
                    ) : policyMismatch ? (
                      <div className="checkout-error" role="alert">
                        {t.policyMismatch}
                        <button type="button" onClick={() => location.reload()}>
                          {t.refresh}
                        </button>
                      </div>
                    ) : null}
                    <Button
                      type="submit"
                      disabled={
                        busy ||
                        catalogLoading ||
                        !catalog ||
                        policyMismatch ||
                        missingProduct
                      }
                    >
                      {busy
                        ? t.sending
                        : uncertain && frozen.current
                          ? t.retry
                          : t.submit}{" "}
                      <span aria-hidden="true">→</span>
                    </Button>
                  </form>
                  <aside className="checkout-summary" aria-label={t.summary}>
                    <h2>{t.summary}</h2>
                    <ul>
                      {cart.map((item) => {
                        const p = products.find(
                          (product) => product.id === item.id,
                        )!;
                        const live = catalog?.products.find(
                          (product) => product.id === item.id,
                        );
                        return (
                          <li key={item.id}>
                            <img
                              src={productIcon(p)}
                              alt=""
                              width="64"
                              height="64"
                            />
                            <div>
                              <strong>
                                {live?.name[lang] || p.name[lang]}
                              </strong>
                              <span>
                                {item.qty} ×{" "}
                                {live ? price(live.unitPriceMinor) : "…"}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="checkout-total">
                      <span>{t.estimate}</span>
                      <strong>{catalog ? price(estimate) : "…"}</strong>
                    </div>
                    <p className="checkout-tax">{t.vat}</p>
                    <p>{t.finalPrice}</p>
                    <div className="checkout-seller">
                      <span>{t.seller}</span>
                      <strong>{seller.shortName}</strong>
                      <p>
                        {seller.address}
                        <br />
                        NIP {seller.nip}
                        <br />
                        KRS {seller.krs}
                      </p>
                      <a href={`mailto:${seller.salesEmail}`}>
                        {seller.salesEmail}
                      </a>
                    </div>
                  </aside>
                </div>
              )}
            </>
          )}
        </main>
        <footer className="checkout-footer">
          <CompanyDetails lang={lang} />
          <span>
            © {new Date().getFullYear()} {seller.shortName}
          </span>
          <a href={legalLink("privacy-policy")}>{t.privacyLink}</a>
          <a href={legalLink("terms")}>{t.termsLink}</a>
        </footer>
      </PageContainer>
    </div>
  );
}
