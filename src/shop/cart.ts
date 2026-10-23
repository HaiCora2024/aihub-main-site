import { products } from "./data";
import {
  cartTotalMinor,
  changeQuantity,
  normalizeCart,
  removeLine,
} from "./pricing";
import type { CartItem } from "./pricing";

export { MAX_QUANTITY } from "./pricing";
export type { CartItem } from "./pricing";
export const CART_KEY = "aihub_cart";

export function readCart(): CartItem[] {
  try {
    return normalizeCart(
      JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"),
      products,
    );
  } catch {
    return [];
  }
}

export const updateQuantity = (
  cart: CartItem[],
  id: number,
  packageId: string,
  delta: number,
) => changeQuantity(cart, products, id, packageId, delta);

export const removeItem = (cart: CartItem[], id: number, packageId: string) =>
  removeLine(cart, id, packageId);

export const cartTotal = (cart: CartItem[]) =>
  cartTotalMinor(cart, products) / 100;
