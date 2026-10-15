import { CART_KEY, readCart } from "./cart";
import type { CartItem } from "./cart";
import { products } from "./data";

const PENDING_KEY = "aihub_pending_request";
const CONSUMED_KEY = "aihub_consumed_requests";
export interface PendingSubmission {
  key: string;
  items: CartItem[];
  createdAt: number;
}

export function readPending(): PendingSubmission | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(PENDING_KEY) || "null");
    if (
      !value ||
      !/^[a-f0-9]{64}$/.test(value.key) ||
      !Number.isFinite(value.createdAt) ||
      !Array.isArray(value.items) ||
      !value.items.length ||
      value.items.length > products.length ||
      value.items.some(
        (i: CartItem) =>
          !i ||
          !products.some((p) => p.id === i.id) ||
          !Number.isInteger(i.qty) ||
          i.qty < 1 ||
          i.qty > 99,
      )
    )
      return null;
    return {
      key: value.key,
      createdAt: value.createdAt,
      items: value.items.map((i: CartItem) => ({ id: i.id, qty: i.qty })),
    };
  } catch {
    return null;
  }
}
export function writePending(value: PendingSubmission | null) {
  try {
    if (value) sessionStorage.setItem(PENDING_KEY, JSON.stringify(value));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* Recovery remains available in this tab's memory. */
  }
}

export async function consumeSubmittedCart(
  snapshot: CartItem[],
  requestId: string,
) {
  const consume = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(CONSUMED_KEY) || "[]");
      const processed: string[] = Array.isArray(raw)
        ? raw.filter((id) => typeof id === "string")
        : [];
      if (processed.includes(requestId)) return;
      const current = readCart();
      const remaining = current
        .map((i) => ({
          id: i.id,
          qty: Math.max(
            0,
            i.qty - (snapshot.find((s) => s.id === i.id)?.qty || 0),
          ),
        }))
        .filter((i) => i.qty > 0);
      // Mark first: a storage failure may leave items, but must not subtract them twice.
      localStorage.setItem(
        CONSUMED_KEY,
        JSON.stringify([...processed.slice(-19), requestId]),
      );
      localStorage.setItem(CART_KEY, JSON.stringify(remaining));
    } catch {
      /* Storage may be blocked; never turn server acceptance into an error. */
    }
  };
  if (navigator.locks)
    await navigator.locks.request("aihub-cart-consume", consume);
  else consume();
}
