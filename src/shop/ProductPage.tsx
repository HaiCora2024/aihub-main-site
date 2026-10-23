import { useRef, useState } from "react";
import type { RefObject } from "react";
import {
  Badge,
  Button,
  CtaFrame,
  DecorativeGlow,
  NavLink,
  PageContainer,
  Section,
  SectionHeading,
  SurfaceCard,
} from "../design-system";
import { SiteHeader } from "../components/SiteHeader";
import { MAX_QUANTITY } from "./cart";
import { CartDrawer, CartGlyph } from "./CartDrawer";
import {
  categories,
  copy,
  formatPackagePrice,
  formatPriceRange,
  productIcon,
  products,
} from "./data";
import type { Product, ShopLanguage } from "./data";
import { MAX_LINES } from "./pricing";
import { ShopFooter } from "./ShopFooter";
import { useShopCart } from "./useShopCart";
import { useShopLanguage } from "./useShopLanguage";

const base = import.meta.env.BASE_URL;


export default function ProductPage({ slug }: { slug: string }) {
  const product = products.find((p) => p.slug === slug);
  const { lang, setLang, t } = useShopLanguage(
    product
      ? { en: `${product.name.en} | AIHUB`, ru: `${product.name.ru} | AIHUB` }
      : {
          en: `${copy.en.notFound} | AIHUB`,
          ru: `${copy.ru.notFound} | AIHUB`,
        },
  );
  const { cart, setCart, count, add } = useShopCart();
  const [cartOpen, setCartOpen] = useState(false);
  const cartButton = useRef<HTMLButtonElement>(null);
  // Focus goes back to whatever opened the cart: a package button or the cart.
  const returnTo = useRef<HTMLElement | null>(null);
  const shopHref = `${base}shop.html?lang=${lang}`;

  return (
    <div className="aihub-theme shop-page shop-pdp" id="top">
      <a className="shop-skip" href="#packages">
        {t.packagesTitle}
      </a>
      <SiteHeader
        lang={lang}
        onLanguageChange={() => setLang(lang === "en" ? "ru" : "en")}
        page="shop"
      />
      <main>
        <PageContainer>
          {product ? (
            <ProductDetails
              product={product}
              lang={lang}
              cartCount={count}
              cartFull={cart.length >= MAX_LINES}
              cartButton={cartButton}
              quantityOf={(packageId) =>
                cart.find(
                  (item) =>
                    item.id === product.id && item.packageId === packageId,
                )?.qty ?? 0
              }
              onOpenCart={() => {
                returnTo.current = cartButton.current;
                setCartOpen(true);
              }}
              onChoose={(packageId) => {
                returnTo.current =
                  document.activeElement instanceof HTMLElement &&
                  document.activeElement !== document.body
                    ? document.activeElement
                    : cartButton.current;
                add(product.id, packageId);
                setCartOpen(true);
              }}
            />
          ) : (
            <Section className="shop-pdp-missing" aria-labelledby="pdp-title">
              <SurfaceCard className="shop-empty-results">
                <h1 id="pdp-title">{t.notFound}</h1>
                <p>{t.notFoundText}</p>
                <Button compact href={shopHref}>
                  {t.backToShop}
                </Button>
              </SurfaceCard>
            </Section>
          )}
        </PageContainer>
      </main>
      <ShopFooter lang={lang} />
      {cartOpen && (
        <CartDrawer
          lang={lang}
          cart={cart}
          setCart={setCart}
          returnFocus={returnTo}
          onClose={() => setCartOpen(false)}
          onBrowse={() => location.assign(shopHref)}
        />
      )}
    </div>
  );
}

interface DetailsProps {
  product: Product;
  lang: ShopLanguage;
  cartCount: number;
  cartFull: boolean;
  cartButton: RefObject<HTMLButtonElement>;
  quantityOf: (packageId: string) => number;
  onOpenCart: () => void;
  onChoose: (packageId: string) => void;
}

function ProductDetails({
  product,
  lang,
  cartCount,
  cartFull,
  cartButton,
  quantityOf,
  onOpenCart,
  onChoose,
}: DetailsProps) {
  const t = copy[lang];
  const category = categories.find((c) => c.id === product.category)!;
  const content = product.content;
  return (
    <>
      <nav className="shop-pdp-breadcrumbs" aria-label={t.breadcrumbLabel}>
        <ol>
          <li>
            <NavLink href={`${base}shop.html?lang=${lang}`}>
              {t.breadcrumbShop}
            </NavLink>
          </li>
          <li>{category.name[lang]}</li>
          <li aria-current="page">{product.name[lang]}</li>
        </ol>
      </nav>

      <Section className="shop-pdp-hero" aria-labelledby="pdp-title">
        <DecorativeGlow tone={category.tone} className="shop-pdp-glow" />
        <div className="shop-pdp-copy">
          <Badge tone={category.tone}>{category.name[lang]}</Badge>
          <SectionHeading id="pdp-title" level={1} description={product.description[lang]}>
            {product.name[lang]}
          </SectionHeading>
          <div className="shop-product-price shop-pdp-price">
            <strong>{formatPriceRange(product, lang)}</strong>
            <span>{t[product.unit]}</span>
          </div>
          <p className="shop-price-note">{t.priceNote}</p>
          <p className="shop-pdp-final">{t.finalPriceNote}</p>
          <button
            className="shop-cart-trigger"
            ref={cartButton}
            type="button"
            onClick={onOpenCart}
            aria-haspopup="dialog"
            aria-label={`${t.cart}: ${cartCount}`}
          >
            <CartGlyph />
            <span>{t.cart}</span>
            <span className="shop-cart-count">{cartCount}</span>
          </button>
        </div>
        <div className="shop-pdp-visual" aria-hidden="true">
          <img
            src={productIcon(product)}
            width="640"
            height="640"
            alt=""
            fetchPriority="high"
          />
        </div>
      </Section>

      <Section
        className="shop-pdp-packages"
        id="packages"
        aria-labelledby="packages-title"
      >
        <SectionHeading id="packages-title">{t.packagesTitle}</SectionHeading>
        <div className="shop-pdp-package-grid">
          {product.packages.map((pkg) => {
            const quantity = quantityOf(pkg.id);
            return (
              <SurfaceCard
                key={pkg.id}
                className="shop-pdp-package"
                tone={category.tone}
                glow={false}
                role="article"
                aria-labelledby={`package-${pkg.id}`}
              >
                <h3 id={`package-${pkg.id}`}>{pkg.name[lang]}</h3>
                <div className="shop-product-price">
                  <strong>{formatPackagePrice(pkg, lang)}</strong>
                  <span>{t[product.unit]}</span>
                </div>
                <p className="shop-price-note">{t.priceNote}</p>
                <ul>
                  {content.packages[pkg.id].map((feature) => (
                    <li key={feature.en}>{feature[lang]}</li>
                  ))}
                </ul>
                <Button
                  compact
                  onClick={() => onChoose(pkg.id)}
                  disabled={
                    quantity >= MAX_QUANTITY || (!quantity && cartFull)
                  }
                  aria-label={`${t.choosePackage}: ${pkg.name[lang]}`}
                >
                  {t.choosePackage}
                  <span className="shop-add-symbol" aria-hidden="true">
                    {quantity ? `(${quantity})` : "+"}
                  </span>
                </Button>
              </SurfaceCard>
            );
          })}
        </div>
        {cartFull && (
          <p className="shop-pdp-cart-full" role="status">
            {t.cartFull}
          </p>
        )}
      </Section>

      <Section className="shop-pdp-info" aria-label={t.priceFactorsTitle}>
        <div>
          <h2>{t.priceFactorsTitle}</h2>
          <ul>
            {content.priceFactors.map((factor) => (
              <li key={factor.en}>{factor[lang]}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{t.processTitle}</h2>
          <ol>
            <li>{t.processDiscuss}</li>
            <li>{t.processProposal}</li>
            <li>{t.processDelivery}</li>
          </ol>
          <p className="shop-pdp-timeline">{content.timeline[lang]}</p>
        </div>
      </Section>

      <Section className="shop-help" aria-labelledby="pdp-help-title">
        <div>
          <SectionHeading id="pdp-help-title" eyebrow={t.helpEyebrow}>
            {t.helpTitle}
          </SectionHeading>
          <p className="aihub-lead">{t.cartDisclaimer}</p>
        </div>
        <div className="shop-help-action">
          <CtaFrame>
            <Button href={`${base}?lang=${lang}#contact`}>
              {t.customCta} <span aria-hidden="true">→</span>
            </Button>
          </CtaFrame>
        </div>
      </Section>
    </>
  );
}
