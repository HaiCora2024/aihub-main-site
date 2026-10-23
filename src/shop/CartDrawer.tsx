import type { Dispatch, RefObject, SetStateAction } from "react";
import { Button } from "../design-system";
import { MAX_QUANTITY, cartTotal, removeItem, updateQuantity } from "./cart";
import type { CartItem } from "./cart";
import { copy, formatPrice, productIcon, products } from "./data";
import type { ShopLanguage } from "./data";
import { ShopDialog } from "./Dialog";

const base = import.meta.env.BASE_URL;

export function CartGlyph() {
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

interface CartDrawerProps {
  lang: ShopLanguage;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  returnFocus: RefObject<HTMLButtonElement>;
  onClose: () => void;
  // The empty state sends people back to the solutions on the current page.
  onBrowse: () => void;
}

// Rendered only while open; ShopDialog handles focus return and Escape.
export function CartDrawer({
  lang,
  cart,
  setCart,
  returnFocus,
  onClose,
  onBrowse,
}: CartDrawerProps) {
  const t = copy[lang];
  const change = (item: CartItem, delta: number) =>
    setCart((current) =>
      updateQuantity(current, item.id, item.packageId, delta),
    );
  return (
    <ShopDialog
      variant="cart"
      title={t.cartTitle}
      closeLabel={t.close}
      returnFocus={returnFocus}
      onDismiss={onClose}
    >
      {cart.length ? (
        <>
          <div className="shop-cart-lines">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.id)!;
              const pkg = product.packages.find(
                (p) => p.id === item.packageId,
              )!;
              const label = `${product.name[lang]} · ${pkg.name[lang]}`;
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
                    <h3>{label}</h3>
                    <p>
                      {formatPrice(pkg.priceMinor / 100, lang)} /{" "}
                      {t[product.unit]}
                    </p>
                    <div className="shop-cart-line-controls">
                      <div
                        className="shop-stepper"
                        role="group"
                        aria-label={`${t.quantity}: ${label}`}
                      >
                        <button
                          type="button"
                          onClick={() => change(item, -1)}
                          aria-label={`${t.decrease}: ${label}`}
                        >
                          −
                        </button>
                        <output aria-label={t.quantity}>{item.qty}</output>
                        <button
                          type="button"
                          disabled={item.qty >= MAX_QUANTITY}
                          onClick={() => change(item, 1)}
                          aria-label={`${t.increase}: ${label}`}
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
                        aria-label={`${t.remove}: ${label}`}
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
              <strong>{formatPrice(cartTotal(cart), lang)}</strong>
            </div>
            <p>{t.rangeNote}</p>
            <Button
              onClick={() =>
                location.assign(`${base}checkout.html?lang=${lang}`)
              }
            >
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
          <Button onClick={onBrowse}>{t.keepBrowsing} →</Button>
        </div>
      )}
    </ShopDialog>
  );
}
