import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProducts } from './ProductsContext';
import { getCurrentUser } from '../utils/session';

const CartContext = createContext(null);
const STORAGE_KEY = 'cart';

// Works for 18, "18" and "$18.00"
const toNumber = (v) => Number(String(v).replace(/[^0-9.]/g, '')) || 0;

function loadLines() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // broken saved data, start with an empty cart
  }
  return [];
}

export function CartProvider({ children }) {
  const { products } = useProducts();

  // The cart only remembers { id, qty }. Name, price and image are read
  // from the products list, so the cart always matches what admin changes.
  const [lines, setLines] = useState(loadLines);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage blocked, the cart still works without saving
    }
  }, [lines]);

  // Returns true if something was added, false if the shelf is already empty
  // (the cart can never hold more than the product's stock).
  const addToCart = (product, qty = 1) => {
    if (!getCurrentUser()) return false; // only people with an account can shop
    const live = products.find((p) => p.id === product.id);
    const inCart = lines.find((l) => l.id === product.id)?.qty ?? 0;
    const room = (live?.stock ?? 0) - inCart;
    if (room <= 0) return false;

    const add = Math.min(qty, room);
    setLines((prev) => {
      const found = prev.find((l) => l.id === product.id);
      if (found) {
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + add } : l));
      }
      return [...prev, { id: product.id, qty: add }];
    });
    return true;
  };

  const setQty = (id, qty) => {
    const max = products.find((p) => p.id === id)?.stock ?? 0;
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, max) } : l))
    );
  };

  const removeFromCart = (id) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clearCart = () => setLines([]);

  // Join the cart lines with the full product info.
  // A product deleted in admin, or sold out, simply disappears from the cart,
  // and a line can never be bigger than the stock that is left.
  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = products.find((x) => x.id === l.id);
          return p && p.stock > 0 ? { ...p, qty: Math.min(l.qty, p.stock) } : null;
        })
        .filter(Boolean),
    [lines, products]
  );

  const cartCount = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + toNumber(i.price) * i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, cartCount, total, addToCart, setQty, removeFromCart, clearCart, toNumber }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);