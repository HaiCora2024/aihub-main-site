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
import { CartDrawer, CartGlyph } from "./CartDrawer";
import { useShopCart } from "./useShopCart";
import { useShopLanguage } from "./useShopLanguage";
import {
  categories,
  formatPriceRange,
  productIcon,
  products,
} from "./data";
import type { CategoryId } from "./data";
import { SiteHeader } from "../components/SiteHeader";
import { ShopFooter } from "./ShopFooter";
import { TypewriterText } from "../components/TypewriterText";

const base = import.meta.env.BASE_URL;
const titles = {
  en: "AI solutions store | AIHUB",
  ru: "Магазин AI-решений | AIHUB",
};

export default function Shop() {
  const { lang, setLang, t } = useShopLanguage(titles);
  const { cart, setCart, count } = useShopCart();
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase());
  const [dialog, setDialog] = useState<"cart" | null>(null);
  const [cartPinned, setCartPinned] = useState(false);
  const cartAnchor = useRef<HTMLDivElement>(null);
  const cartButton = useRef<HTMLButtonElement>(null);
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
                          <p className="shop-price-note">{t.priceNote}</p>
                          <Button
                            compact
                            href={`${base}shop/${product.slug}.html?lang=${lang}`}
                            aria-label={`${t.details}: ${product.name[lang]}`}
                          >
                            {t.details}
                            <span
                              className="shop-add-symbol"
                              aria-hidden="true"
                            >
                              →
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

      <ShopFooter lang={lang} />

      {dialog && (
        <CartDrawer
          lang={lang}
          cart={cart}
          setCart={setCart}
          returnFocus={cartButton}
          onClose={() => setDialog(null)}
          onBrowse={() => {
            setDialog(null);
            document.getElementById("solutions")?.scrollIntoView({
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
          }}
        />
      )}
    </div>
  );
}
