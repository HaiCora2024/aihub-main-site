// Pure price and cart rules shared by the shop pages; no browser or data imports
// so `node --test` can load this file directly.
export interface ShopPackage {
  id: string;
  priceMinor: number;
  openEnded: boolean;
  name: Record<string, string>;
}
export interface PricedProduct {
  id: number;
  packages: ShopPackage[];
}
export interface CartItem {
  id: number;
  packageId: string;
  qty: number;
}
// Pending submissions saved before packages may omit packageId; the server
// then uses the cheapest package, so they are re-sent unchanged.
export interface RequestItem {
  id: number;
  packageId?: string;
  qty: number;
}

export const MAX_QUANTITY = 99;
export const MAX_LINES = 8;

export function cheapestPackage(product: PricedProduct): ShopPackage {
  return product.packages.reduce((min, p) =>
    p.priceMinor < min.priceMinor ? p : min,
  );
}

const dearestPackage = (product: PricedProduct) =>
  product.packages.reduce((max, p) =>
    p.priceMinor > max.priceMinor ? p : max,
  );

export function priceRange(product: PricedProduct) {
  const from = cheapestPackage(product);
  const to = dearestPackage(product);
  return {
    fromMinor: from.priceMinor,
    toMinor: to.priceMinor,
    openEnded: to.openEnded,
    single: product.packages.length === 1,
  };
}

export function findPackage(
  products: PricedProduct[],
  id: number,
  packageId: string,
): ShopPackage | undefined {
  return products
    .find((p) => p.id === id)
    ?.packages.find((p) => p.id === packageId);
}

// Lines saved before packages have no packageId and use the cheapest package.
export const itemPackage = (products: PricedProduct[], item: RequestItem) => {
  const product = products.find((p) => p.id === item.id);
  if (!product) return undefined;
  return item.packageId === undefined
    ? cheapestPackage(product)
    : product.packages.find((p) => p.id === item.packageId);
};

const isItem = (value: unknown): value is RequestItem =>
  !!value &&
  typeof value === "object" &&
  Number.isSafeInteger((value as RequestItem).id) &&
  Number.isSafeInteger((value as RequestItem).qty);

export function normalizeCart(
  value: unknown,
  products: PricedProduct[],
): CartItem[] {
  if (!Array.isArray(value)) return [];
  const clean = new Map<string, CartItem>();
  for (const item of value) {
    if (!isItem(item) || item.qty <= 0) continue;
    const pkg = itemPackage(products, item);
    if (!pkg) continue;
    const key = `${item.id}:${pkg.id}`;
    const qty = Math.min(MAX_QUANTITY, (clean.get(key)?.qty ?? 0) + item.qty);
    clean.set(key, { id: item.id, packageId: pkg.id, qty });
  }
  return [...clean.values()];
}

export function normalizePending(
  value: unknown,
  products: PricedProduct[],
): RequestItem[] | null {
  if (
    !Array.isArray(value) ||
    !value.length ||
    value.length > MAX_LINES ||
    value.some(
      (item) =>
        !isItem(item) ||
        item.qty < 1 ||
        item.qty > MAX_QUANTITY ||
        !itemPackage(products, item),
    )
  )
    return null;
  return value.map((item: RequestItem) =>
    item.packageId === undefined
      ? { id: item.id, qty: item.qty }
      : { id: item.id, packageId: item.packageId, qty: item.qty },
  );
}

const sameLine = (item: CartItem, id: number, packageId: string) =>
  item.id === id && item.packageId === packageId;

export function changeQuantity(
  cart: CartItem[],
  products: PricedProduct[],
  id: number,
  packageId: string,
  delta: number,
): CartItem[] {
  if (!findPackage(products, id, packageId) || !Number.isSafeInteger(delta))
    return cart;
  const current = cart.find((item) => sameLine(item, id, packageId));
  const qty = Math.max(0, Math.min(MAX_QUANTITY, (current?.qty ?? 0) + delta));
  if (qty === 0) return removeLine(cart, id, packageId);
  if (!current) return [...cart, { id, packageId, qty }];
  return cart.map((item) =>
    sameLine(item, id, packageId) ? { id, packageId, qty } : item,
  );
}

export function removeLine(
  cart: CartItem[],
  id: number,
  packageId: string,
): CartItem[] {
  return cart.filter((item) => !sameLine(item, id, packageId));
}

export function cartTotalMinor(
  cart: RequestItem[],
  products: PricedProduct[],
): number {
  return cart.reduce(
    (total, item) =>
      total + (itemPackage(products, item)?.priceMinor ?? 0) * item.qty,
    0,
  );
}

// Storage events also fire when another tab only rewrites the same cart
// (for example migrating the legacy format); those must not reset checkout.
export function sameCart(a: CartItem[], b: CartItem[]): boolean {
  return (
    a.length === b.length &&
    a.every((item) =>
      b.some(
        (other) =>
          sameLine(other, item.id, item.packageId) && other.qty === item.qty,
      ),
    )
  );
}
