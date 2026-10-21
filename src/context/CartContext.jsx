import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProducts } from './ProductsContext';

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

  const addToCart = (product, qty = 1) =>
    setLines((prev) => {
      const found = prev.find((l) => l.id === product.id);
      if (found) {
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { id: product.id, qty }];
    });

  const setQty = (id, qty) =>
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l))
    );

  const removeFromCart = (id) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clearCart = () => setLines([]);

  // Join the cart lines with the full product info
  // (a product deleted in admin simply disappears from the cart)
  const items = useMemo(
    () =>
      lines
        .map((l) => {
          const p = products.find((x) => x.id === l.id);
          return p ? { ...p, qty: l.qty } : null;
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