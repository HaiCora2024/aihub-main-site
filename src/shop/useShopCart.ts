import { useEffect, useState } from "react";
import { CART_KEY, cartTotal, readCart, updateQuantity } from "./cart";

export function useShopCart() {
  const [cart, setCart] = useState(readCart);

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

  return {
    cart,
    setCart,
    count: cart.reduce((sum, item) => sum + item.qty, 0),
    total: cartTotal(cart),
    add: (id: number, packageId: string) =>
      setCart((current) => updateQuantity(current, id, packageId, 1)),
  };
}
