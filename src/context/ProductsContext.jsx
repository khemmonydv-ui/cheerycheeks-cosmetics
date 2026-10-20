import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ProductsContext = createContext(null);

const STORAGE_KEY = 'products';

// Give every product a stock count and a visibility flag
const withDefaults = (p) => ({ stock: 10, visible: true, image: '', ...p });

// Use the saved list from the browser if there is one, otherwise the starting list
function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).map(withDefaults);
  } catch {
    // saved data is broken, fall back to the starting list
  }
  return initialProducts.map(withDefaults);
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadProducts);

  // Save every change, so refreshing the page keeps it
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch {
      // storage full or blocked, the app still works without saving
    }
  }, [products]);

  const addProduct = (product) =>
    setProducts((prev) => [...prev, withDefaults({ ...product, id: Date.now() })]);

  const updateProduct = (id, changes) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const deleteProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const toggleVisible = (id) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p)));

  return (
    <ProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, toggleVisible }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);