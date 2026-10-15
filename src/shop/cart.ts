import { products } from "./data";

export const CART_KEY = "aihub_cart";
export const MAX_QUANTITY = 99;
export interface CartItem {
  id: number;
  qty: number;
}
export interface DemoOrder {
  id: string;
  createdAt: string;
  items: { id: number; name: string; qty: number; price: number }[];
  total: number;
  currency: "USD";
  mode: "demo";
}

export function readCart(): CartItem[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
    if (!Array.isArray(value)) return [];
    const clean = new Map<number, number>();
    for (const item of value) {
      if (
        !item ||
        typeof item !== "object" ||
        !products.some((p) => p.id === item.id)
      )
        continue;
      if (!Number.isSafeInteger(item.qty) || item.qty <= 0) continue;
      clean.set(
        item.id,
        Math.min(MAX_QUANTITY, (clean.get(item.id) ?? 0) + item.qty),
      );
    }
    return [...clean].map(([id, qty]) => ({ id, qty }));
  } catch {
    return [];
  }
}

export function updateQuantity(
  cart: CartItem[],
  id: number,
  delta: number,
): CartItem[] {
  if (!products.some((p) => p.id === id) || !Number.isSafeInteger(delta))
    return cart;
  const current = cart.find((item) => item.id === id);
  const qty = Math.max(0, Math.min(MAX_QUANTITY, (current?.qty ?? 0) + delta));
  if (qty === 0) return cart.filter((item) => item.id !== id);
  if (!current) return [...cart, { id, qty }];
  return cart.map((item) => (item.id === id ? { id, qty } : item));
}

export const cartTotal = (cart: CartItem[]) =>
  cart.reduce(
    (total, item) =>
      total + (products.find((p) => p.id === item.id)?.price ?? 0) * item.qty,
    0,
  );

export function createDemoOrder(cart: CartItem[]): DemoOrder {
  return {
    id: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    items: cart.flatMap((item) => {
      const product = products.find((p) => p.id === item.id);
      return product
        ? [
            {
              id: item.id,
              name: product.name.en,
              qty: item.qty,
              price: product.price,
            },
          ]
        : [];
    }),
    total: cartTotal(cart),
    currency: "USD",
    mode: "demo",
  };
}
