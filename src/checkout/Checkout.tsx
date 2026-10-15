import { useEffect, useState } from "react";
import {
  DecorativeGlow,
  NavLink,
  PageContainer,
  Section,
  SectionHeading,
} from "../design-system";
import { SiteHeader, SiteLogo } from "../components/SiteHeader";
import { CART_KEY } from "../shop/cart";
import { copy } from "../shop/data";
import type { ShopLanguage } from "../shop/data";
import { ECWID_STORE_ID } from "../shop/ecwid";
import { loadEcwid } from "./ecwid-loader";

const base = import.meta.env.BASE_URL;
const containerId = `my-store-${ECWID_STORE_ID || "disabled"}`;

type CheckoutStatus = "loading" | "ready" | "done" | "error" | "disabled";

/** Hosts the Ecwid cart & checkout widget inside the AIHUB layout. */
export function Checkout() {
  const lang: ShopLanguage =
    new URLSearchParams(location.search).get("lang") === "ru" ? "ru" : "en";
  const t = copy[lang];
  const [status, setStatus] = useState<CheckoutStatus>(
    ECWID_STORE_ID ? "loading" : "disabled",
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "ru" ? "Оформление заказа | AIHUB" : "Checkout | AIHUB";
  }, [lang]);

  useEffect(() => {
    if (!ECWID_STORE_ID) return;
    let active = true;
    loadEcwid(ECWID_STORE_ID, containerId, lang)
      .then((ecwid) => {
        if (!active) return;
        setStatus("ready");
        ecwid.OnPageLoaded.add((page) => {
          if (page.type !== "ORDER_CONFIRMATION") return;
          try {
            localStorage.removeItem(CART_KEY);
          } catch {
            /* Storage may be unavailable; the order is already placed. */
          }
          setStatus("done");
        });
        // Opened directly (no pre-filled cart in the URL): show the Ecwid cart.
        if (!location.hash.startsWith("#!")) ecwid.openPage("cart");
      })
      .catch((error: unknown) => {
        console.error("[checkout]", error);
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [lang]);

  const switchLanguage = () => {
    const url = new URL(location.href);
    url.searchParams.set("lang", lang === "en" ? "ru" : "en");
    location.assign(url.toString());
  };

  return (
    <div className="aihub-theme shop-page checkout-page" id="top">
      <SiteHeader lang={lang} onLanguageChange={switchLanguage} page="shop" />

      <main>
        <PageContainer>
          <Section className="checkout-hero" aria-labelledby="checkout-title">
            <DecorativeGlow className="shop-hero-glow" />
            <NavLink href={`${base}shop.html?lang=${lang}`}>
              <span aria-hidden="true">←</span> {t.checkoutBack}
            </NavLink>
            <SectionHeading
              id="checkout-title"
              level={1}
              description={t.checkoutIntro}
            >
              {t.checkoutTitle}
            </SectionHeading>
          </Section>

          <Section className="checkout-body" aria-live="polite">
            {status === "done" && (
              <p className="checkout-note checkout-note--success" role="status">
                ✓ {t.checkoutDone}
              </p>
            )}
            {status === "error" && (
              <p className="checkout-note checkout-note--error" role="alert">
                {t.checkoutError}{" "}
                <NavLink href={`${base}?lang=${lang}#contact`}>
                  {t.helpCta} →
                </NavLink>
              </p>
            )}
            {status === "error" ? null : status === "disabled" ? (
              <p className="checkout-note">
                {t.checkoutDisabled}{" "}
                <NavLink href={`${base}shop.html?lang=${lang}`}>
                  {t.checkoutBack} →
                </NavLink>
              </p>
            ) : (
              <div
                className="checkout-panel"
                data-status={status}
                aria-busy={status === "loading"}
              >
                {status === "loading" && (
                  <p className="checkout-loading">{t.checkoutLoading}</p>
                )}
                <div id={containerId} />
              </div>
            )}
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
          <div className="shop-footer-bottom">
            <span>© {new Date().getFullYear()} AIHUB</span>
            <NavLink href={`${base}legal/privacy-policy.html`}>
              {t.privacy}
            </NavLink>
            <NavLink href={`${base}legal/terms.html`}>{t.terms}</NavLink>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
