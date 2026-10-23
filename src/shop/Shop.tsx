import { useDeferredValue, useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  CtaFrame,
  DecorativeGlow,
  Grid,
  NavLink,
  PageContainer,
  Reveal,
  Section,
  SectionHeading,
  SurfaceCard,
  TextField,
} from "../design-system";
import {
  CART_KEY,
  MAX_QUANTITY,
  cartTotal,
  readCart,
  removeItem,
  updateQuantity,
} from "./cart";
import { cheapestPackage } from "./pricing";
import {
  categories,
  copy,
  formatPrice,
  formatPriceRange,
  productIcon,
  products,
} from "./data";
import type { CategoryId, Product, ShopLanguage } from "./data";
import { ShopDialog } from "./Dialog";
import { SiteHeader, SiteLogo } from "../components/SiteHeader";
import { CompanyDetails } from "../components/CompanyDetails";
import { TypewriterText } from "../components/TypewriterText";

const base = import.meta.env.BASE_URL;

function CartGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path
        d="M3 4h2l2.5 12h11L21 7H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

export default function Shop() {
  const [lang, setLang] = useState<ShopLanguage>(() =>
    new URLSearchParams(location.search).get("lang") === "ru" ? "ru" : "en",
  );
  const t = copy[lang];
  const [cart, setCart] = useState(readCart);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const [dialog, setDialog] = useState<"cart" | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [cartPinned, setCartPinned] = useState(false);
  const cartAnchor = useRef<HTMLDivElement>(null);
  const cartButton = useRef<HTMLButtonElement>(null);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cartTotal(cart);
  const visibleProducts = products.filter((product) => {
    const categoryInfo = categories.find(
      (item) => item.id === product.category,
    )!;
    const searchable = [
      product.name.en,
      product.name.ru,
      product.description[lang],
      categoryInfo.name[lang],
    ]
      .join(" ")
      .toLocaleLowerCase();
    return (
      (category === "all" || product.category === category) &&
      searchable.includes(deferredQuery)
    );
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "ru"
        ? "Магазин AI-решений | AIHUB"
        : "AI solutions store | AIHUB";
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* The cart remains usable when browser storage is unavailable. */
    }
  }, [cart]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === CART_KEY || event.key === null) setCart(readCart());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!announcement) return;
    const timer = window.setTimeout(() => setAnnouncement(""), 2400);
    return () => window.clearTimeout(timer);
  }, [announcement]);

  useEffect(() => {
    const anchor = cartAnchor.current!;
    const button = cartButton.current!;
    // Keep the original slot stable when the same button leaves document flow.
    const resize = new ResizeObserver(([entry]) => {
      const size = entry.borderBoxSize[0];
      anchor.style.inlineSize = `${size.inlineSize}px`;
      anchor.style.blockSize = `${size.blockSize}px`;
    });
    const intersection = new IntersectionObserver(
      ([entry]) => setCartPinned(entry.boundingClientRect.top < 16),
      { rootMargin: "-16px 0px 0px 0px", threshold: [0, 1] },
    );
    resize.observe(button);
    intersection.observe(anchor);
    return () => {
      resize.disconnect();
      intersection.disconnect();
    };
  }, []);

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
  };
  const addToCart = (product: Product) => {
    // Cards add the entry package until product pages take over (Task 7).
    const pkg = cheapestPackage(product);
    setCart((current) => updateQuantity(current, product.id, pkg.id, 1));
    setAnnouncement(`${product.name[lang]}: ${t.added}`);
  };
  const checkout = () => {
    if (!cart.length) return;
    location.assign(`${base}checkout.html?lang=${lang}`);
  };

  return (
    <div className="aihub-theme shop-page" id="top">
      <a className="shop-skip" href="#solutions">
        {t.skip}
      </a>
      <SiteHeader
        lang={lang}
        onLanguageChange={() => setLang(lang === "en" ? "ru" : "en")}
        page="shop"
      />

      <main>
        <PageContainer>
          <Section className="shop-hero" aria-labelledby="shop-title">
            <DecorativeGlow className="shop-hero-glow" />
            <div className="shop-hero-copy">
              <SectionHeading id="shop-title" level={1} description={t.intro}>
                <TypewriterText
                  key={lang}
                  lines={[
                    { text: t.title.toLocaleUpperCase(lang), color: "#ffffff" },
                    {
                      text: t.titleAccent.toLocaleUpperCase(lang),
                      color: "#08d070",
                    },
                  ]}
                />
              </SectionHeading>
              <CtaFrame>
                <Button href="#solutions">
                  {t.browse} <span aria-hidden="true">→</span>
                </Button>
              </CtaFrame>
            </div>
            <div className="shop-hero-art" aria-hidden="true">
              <div className="shop-orbit shop-orbit--one" />
              <div className="shop-orbit shop-orbit--two" />
              <img
                className="shop-hero-icon shop-hero-icon--main"
                src={productIcon(products[0])}
                width="640"
                height="640"
                alt=""
                fetchPriority="high"
              />
              <img
                className="shop-hero-icon shop-hero-icon--chat"
                src={productIcon(products[1])}
                width="640"
                height="640"
                alt=""
              />
              <img
                className="shop-hero-icon shop-hero-icon--analytics"
                src={productIcon(products[4])}
                width="640"
                height="640"
                alt=""
              />
            </div>
          </Section>

          <Section
            className="shop-catalog"
            id="solutions"
            aria-labelledby="catalog-title"
          >
            <div className="shop-catalog-heading">
              <SectionHeading id="catalog-title">{t.catalog}</SectionHeading>
              <div className="shop-cart-anchor" ref={cartAnchor}>
                <button
                  className={`shop-cart-trigger${cartPinned ? " shop-cart-trigger--pinned" : ""}`}
                  ref={cartButton}
                  type="button"
                  onClick={() => setDialog("cart")}
                  aria-haspopup="dialog"
                  aria-label={`${t.cart}: ${count}`}
                >
                  <CartGlyph />
                  <span>{t.cart}</span>
                  <span className="shop-cart-count">{count}</span>
                </button>
              </div>
            </div>
            <div className="shop-toolbar">
              <div
                className="shop-filters"
                role="group"
                aria-label={t.catalogLabel}
              >
                <button
                  type="button"
                  className="shop-filter"
                  aria-pressed={category === "all"}
                  onClick={() => setCategory("all")}
                >
                  {t.all}
                </button>
                {categories.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="shop-filter"
                    aria-pressed={category === item.id}
                    onClick={() => setCategory(item.id)}
                  >
                    {item.name[lang]}
                  </button>
                ))}
              </div>
              <TextField
                type="search"
                label={t.search}
                placeholder={t.searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
              />
            </div>
            <p className="shop-results-status" role="status" aria-live="polite">
              {visibleProducts.length} {t.found}
            </p>
            {(query || category !== "all") && (
              <div className="shop-results-meta">
                <button
                  className="shop-text-button"
                  type="button"
                  onClick={resetFilters}
                >
                  {t.clear} <span aria-hidden="true">×</span>
                </button>
              </div>
            )}

            {visibleProducts.length ? (
              <Grid className="shop-products" columns={3}>
                {visibleProducts.map((product, index) => {
                  const categoryInfo = categories.find(
                    (item) => item.id === product.category,
                  )!;
                  const quantity =
                    cart.find(
                      (item) =>
                        item.id === product.id &&
                        item.packageId === cheapestPackage(product).id,
                    )?.qty ?? 0;
                  return (
                    <Reveal key={product.id} index={index % 3}>
                      <SurfaceCard
                        className="shop-product-card"
                        tone={categoryInfo.tone}
                        glow={false}
                        role="article"
                        aria-labelledby={`product-${product.id}`}
                      >
                        <div className="shop-product-top">
                          <Badge tone={categoryInfo.tone}>
                            {categoryInfo.name[lang]}
                          </Badge>
                        </div>
                        <div className="shop-product-visual">
                          <img
                            src={productIcon(product)}
                            width="640"
                            height="640"
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="shop-product-body">
                          <h3 id={`product-${product.id}`}>
                            {product.name[lang]}
                          </h3>
                          <p>{product.description[lang]}</p>
                          <div className="shop-product-price">
                            <strong>{formatPriceRange(product, lang)}</strong>
                            <span>{t[product.unit]}</span>
                          </div>
                          <Button
                            compact
                            onClick={() => addToCart(product)}
                            disabled={quantity >= MAX_QUANTITY}
                            aria-label={`${t.add}: ${product.name[lang]}`}
                          >
                            {t.add}
                            <span
                              className="shop-add-symbol"
                              aria-hidden="true"
                            >
                              {quantity ? `(${quantity})` : "+"}
                            </span>
                          </Button>
                        </div>
                      </SurfaceCard>
                    </Reveal>
                  );
                })}
                {category === "all" && !deferredQuery && (
                  <Reveal index={2}>
                    <SurfaceCard
                      className="shop-custom-card"
                      tone="green"
                      border="solid"
                    >
                      <span className="shop-cross" aria-hidden="true">
                        +
                      </span>
                      <span className="aihub-eyebrow">{t.customLabel}</span>
                      <h3>{t.customTitle}</h3>
                      <p>{t.customText}</p>
                      <NavLink href={`${base}?lang=${lang}#contact`}>
                        {t.customCta} <span aria-hidden="true">→</span>
                      </NavLink>
                    </SurfaceCard>
                  </Reveal>
                )}
              </Grid>
            ) : (
              <SurfaceCard className="shop-empty-results">
                <span className="shop-empty-symbol" aria-hidden="true">
                  ∅
                </span>
                <h3>{t.noResults}</h3>
                <p>{t.noResultsText}</p>
                <Button compact onClick={resetFilters}>
                  {t.clear}
                </Button>
              </SurfaceCard>
            )}
          </Section>

          <Section className="shop-help" aria-labelledby="shop-help-title">
            <DecorativeGlow tone="blue" className="shop-help-glow" />
            <div>
              <SectionHeading id="shop-help-title" eyebrow={t.helpEyebrow}>
                {t.helpTitle}
              </SectionHeading>
              <p className="aihub-lead">{t.helpText}</p>
            </div>
            <div className="shop-help-action">
              <CtaFrame>
                <Button href={`${base}?lang=${lang}#contact`}>
                  {t.helpCta} <span aria-hidden="true">→</span>
                </Button>
              </CtaFrame>
            </div>
          </Section>
        </PageContainer>
      </main>

      <footer className="shop-footer">
        <PageContainer>
          <div className="shop-footer-top">
            <div>
              <SiteLogo lang={lang} />
              <p>{t.footerLine}</p>
            </div>
            <NavLink href="mailto:techcrew@aihub.works">
              techcrew@aihub.works <span aria-hidden="true">→</span>
            </NavLink>
          </div>
          <CompanyDetails lang={lang} />
          <div className="shop-footer-bottom">
            <span>© {new Date().getFullYear()} AIHUB</span>
            <NavLink href={`${base}legal/privacy-policy.html?lang=${lang}`}>
              {t.privacy}
            </NavLink>
            <NavLink href={`${base}legal/terms.html?lang=${lang}`}>
              {t.terms}
            </NavLink>
            <NavLink href="#top">{t.top} ↑</NavLink>
          </div>
        </PageContainer>
      </footer>

      <div
        className={`shop-toast${announcement ? " shop-toast--visible" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      {dialog && (
        <ShopDialog
          variant={dialog}
          title={t.cartTitle}
          closeLabel={t.close}
          returnFocus={cartButton}
          onDismiss={() => setDialog(null)}
        >
          {cart.length ? (
            <>
              <div className="shop-cart-lines">
                {cart.map((item) => {
                  const product = products.find((p) => p.id === item.id)!;
                  const pkg = product.packages.find(
                    (p) => p.id === item.packageId,
                  )!;
                  return (
                    <article
                      key={`${item.id}:${item.packageId}`}
                      className="shop-cart-line"
                    >
                      <img
                        src={productIcon(product)}
                        width="88"
                        height="88"
                        alt=""
                      />
                      <div className="shop-cart-line-content">
                        <h3>{product.name[lang]}</h3>
                        <p>
                          {formatPrice(pkg.priceMinor / 100, lang)} /{" "}
                          {t[product.unit]}
                        </p>
                        <div className="shop-cart-line-controls">
                          <div
                            className="shop-stepper"
                            role="group"
                            aria-label={`${t.quantity}: ${product.name[lang]}`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                setCart((current) =>
                                  updateQuantity(
                                    current,
                                    item.id,
                                    item.packageId,
                                    -1,
                                  ),
                                )
                              }
                              aria-label={`${t.decrease}: ${product.name[lang]}`}
                            >
                              −
                            </button>
                            <output aria-label={t.quantity}>{item.qty}</output>
                            <button
                              type="button"
                              disabled={item.qty >= MAX_QUANTITY}
                              onClick={() =>
                                setCart((current) =>
                                  updateQuantity(
                                    current,
                                    item.id,
                                    item.packageId,
                                    1,
                                  ),
                                )
                              }
                              aria-label={`${t.increase}: ${product.name[lang]}`}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="shop-text-button"
                            type="button"
                            onClick={() =>
                              setCart((current) =>
                                removeItem(current, item.id, item.packageId),
                              )
                            }
                            aria-label={`${t.remove}: ${product.name[lang]}`}
                          >
                            {t.remove}
                          </button>
                        </div>
                      </div>
                      <strong className="shop-line-total">
                        {formatPrice((pkg.priceMinor * item.qty) / 100, lang)}
                      </strong>
                    </article>
                  );
                })}
              </div>
              <div className="shop-cart-summary">
                <div className="shop-total" aria-live="polite">
                  <span>{t.total}</span>
                  <strong>{formatPrice(total, lang)}</strong>
                </div>
                <p>{t.rangeNote}</p>
                <Button onClick={checkout}>
                  {t.checkout} <span aria-hidden="true">→</span>
                </Button>
                <p>{t.cartDisclaimer}</p>
              </div>
            </>
          ) : (
            <div className="shop-cart-empty">
              <CartGlyph />
              <h3>{t.empty}</h3>
              <p>{t.emptyText}</p>
              <Button
                onClick={() => {
                  setDialog(null);
                  document.getElementById("solutions")?.scrollIntoView({
                    behavior: matchMedia("(prefers-reduced-motion: reduce)")
                      .matches
                      ? "instant"
                      : "smooth",
                  });
                }}
              >
                {t.keepBrowsing} →
              </Button>
            </div>
          )}
        </ShopDialog>
      )}
    </div>
  );
}
