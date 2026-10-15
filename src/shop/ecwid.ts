import ecwidProductMap from "./ecwid-products.json";
import { products } from "./data";
import type { ShopLanguage } from "./data";
import type { CartItem } from "./cart";

/**
 * Ecwid integration.
 *
 * The shop keeps its own catalog UI and cart. Ecwid is used only for
 * checkout, payment and order management: on "Checkout" the visitor is sent
 * to `checkout.html` with a pre-filled Ecwid cart in the URL
 * (`#!/~/cart/create=…`). Ecwid re-reads prices from the store, so prices
 * shown here are never trusted for payment.
 *
 * Live mode turns on only when BOTH are true:
 * - `VITE_ECWID_STORE_ID` is set at build time (public, safe for the browser);
 * - every product in `data.ts` has an Ecwid product ID in
 *   `ecwid-products.json` (filled by `npm run ecwid:sync`).
 * Otherwise the shop stays in the local demo mode.
 */

const rawStoreId = (import.meta.env.VITE_ECWID_STORE_ID ?? "").trim();
export const ECWID_STORE_ID = /^\d+$/.test(rawStoreId) ? rawStoreId : "";

const productIds: Record<string, number> = ecwidProductMap;

/** Ecwid product ID for a shop product slug, if it was synced. */
export const ecwidProductId = (slug: string): number | undefined => {
  const id = productIds[slug];
  return Number.isSafeInteger(id) && id > 0 ? id : undefined;
};

const unmapped = products.filter((p) => !ecwidProductId(p.slug));

export const isEcwidEnabled = Boolean(ECWID_STORE_ID) && unmapped.length === 0;

if (ECWID_STORE_ID && unmapped.length) {
  console.warn(
    `[shop] Ecwid store is configured, but these products have no Ecwid ID: ${unmapped
      .map((p) => p.slug)
      .join(", ")}. Run "npm run ecwid:sync". The shop stays in demo mode.`,
  );
}

export interface EcwidCartPayload {
  gotoCheckout: boolean;
  products: { id: number; quantity: number }[];
}

export function ecwidCartPayload(cart: CartItem[]): EcwidCartPayload {
  return {
    gotoCheckout: true,
    products: cart.flatMap((item) => {
      const product = products.find((p) => p.id === item.id);
      const id = product && ecwidProductId(product.slug);
      return id ? [{ id, quantity: item.qty }] : [];
    }),
  };
}

/** URL of the page that hosts the Ecwid checkout widget. */
export function checkoutPageUrl(lang: ShopLanguage): string {
  const custom = (import.meta.env.VITE_ECWID_CHECKOUT_URL ?? "").trim();
  return custom || `${import.meta.env.BASE_URL}checkout.html?lang=${lang}`;
}

/** Full link that opens Ecwid with the visitor's cart already filled in. */
export function ecwidCheckoutUrl(cart: CartItem[], lang: ShopLanguage): string {
  const payload = encodeURIComponent(JSON.stringify(ecwidCartPayload(cart)));
  return `${checkoutPageUrl(lang)}#!/~/cart/create=${payload}`;
}
