import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { loadShopData, countSold } from '../api/shopApi';
import { getProductMeta, categoryColor } from '../data/productMeta';
import { LOW_STOCK_LIMIT } from '../utils/stock';

const ProductsContext = createContext(null);

// The JSON files are read-only, so everything the admin or a customer changes
// is saved here, on top of the JSON:
//   edits    { [productId]: { price, stock, ... } }  changes to JSON products
//   added    [ product, ... ]                         products made in admin
//   deleted  [ productId, ... ]                       JSON products removed in admin
//   reviews  { [productId]: [ review, ... ] }         customer reviews
const STORAGE_KEY = 'cherrycheeks-product-changes';
const NO_CHANGES = { edits: {}, added: [], deleted: [], reviews: {} };

// The only fields the admin form may change on a product
const EDITABLE = ['name', 'description', 'price', 'stock', 'image', 'visible'];

// A product that sold at least this many units gets the "Bestseller" badge
const BESTSELLER_MIN_SOLD = 2;

function loadChanges() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return { ...NO_CHANGES, ...saved };
  } catch {
    // saved data is broken, start without changes
  }
  return NO_CHANGES;
}

// A copy of an object without one key
const withoutKey = (obj, key) =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== String(key)));

// Turn one record of products.json into the shape the pages use.
// products.json  ->  here:   stockQuantity -> stock,   active -> visible
function fromJson(raw, sold) {
  const meta = getProductMeta(raw.id, raw.categoryId);
  return {
    id: raw.id,
    sku: raw.sku,
    brand: raw.brand,
    name: raw.name,
    categoryId: raw.categoryId,
    price: Number(raw.price),
    stock: Number(raw.stockQuantity),
    visible: Boolean(raw.active),
    // the picture written in products.json wins; the old built-in one is only a fallback
    image: raw.image || meta.image,
    bg: meta.bg,
    description: meta.description,
    sold,
  };
}

// Add everything that is worked out from other data:
// category name, reviews, rating and badge.
function finish(product, categoryNames, reviews = []) {
  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  let badge = '';
  if (product.stock <= 0) badge = 'Sold out';
  else if (product.sold >= BESTSELLER_MIN_SOLD) badge = 'Bestseller';
  else if (product.stock <= LOW_STOCK_LIMIT) badge = 'Low stock';

  return {
    ...product,
    category: categoryNames.get(product.categoryId) ?? 'Uncategorized',
    reviews,
    rating: Math.round(average * 10) / 10,
    reviewCount: reviews.length,
    badge,
  };
}

export function ProductsProvider({ children }) {
  const [data, setData] = useState(null); // { products, categories, invoices } from the JSON
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [changes, setChanges] = useState(loadChanges);

  // Load the JSON files (again when "Try again" is pressed)
  useEffect(() => {
    const controller = new AbortController();
    loadShopData(controller.signal)
      .then((loaded) => {
        setData(loaded);
        setError('');
        setStatus('ready');
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setStatus('error');
      });
    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setStatus('loading');
    setAttempt((n) => n + 1);
  }, []);

  // Save every change, so refreshing the page keeps it
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
    } catch {
      // storage full or blocked, the app still works without saving
    }
  }, [changes]);

  const categories = useMemo(() => data?.categories ?? [], [data]);

  // JSON products + the saved changes = the list every page shows
  const products = useMemo(() => {
    if (!data) return [];
    const names = new Map(data.categories.map((c) => [c.id, c.name]));
    const sold = countSold(data.invoices);

    const fromFile = data.products
      .filter((raw) => !changes.deleted.includes(raw.id))
      .map((raw) => ({ ...fromJson(raw, sold.get(raw.id) ?? 0), ...changes.edits[raw.id] }));

    return [...fromFile, ...changes.added].map((p) => finish(p, names, changes.reviews[p.id]));
  }, [data, changes]);

  // The admin form gives a category NAME, the data stores the category id.
  // Only fields that really changed are kept, so the JSON stays the source of truth.
  const toChanges = useCallback(
    (current, input) => {
      const out = {};
      for (const key of EDITABLE) {
        if (key in input && input[key] !== current?.[key]) out[key] = input[key];
      }
      const category = categories.find((c) => c.name === input.category);
      if (category && category.id !== current?.categoryId) out.categoryId = category.id;
      return out;
    },
    [categories]
  );

  const addProduct = (input) => {
    const categoryId = categories.find((c) => c.name === input.category)?.id ?? categories[0]?.id;
    const product = {
      id: Date.now(),
      sku: '',
      brand: 'Cherry Cheeks',
      categoryId,
      sold: 0,
      bg: categoryColor(categoryId),
      name: '',
      description: '',
      image: '',
      price: 0,
      stock: 0,
      visible: true,
      ...toChanges(null, input),
    };
    setChanges((prev) => ({ ...prev, added: [...prev.added, product] }));
  };

  const updateProduct = (id, input) => {
    const delta = toChanges(products.find((p) => p.id === id), input);
    setChanges((prev) => {
      if (prev.added.some((p) => p.id === id)) {
        return { ...prev, added: prev.added.map((p) => (p.id === id ? { ...p, ...delta } : p)) };
      }
      return { ...prev, edits: { ...prev.edits, [id]: { ...prev.edits[id], ...delta } } };
    });
  };

  const deleteProduct = (id) =>
    setChanges((prev) => {
      const wasAdded = prev.added.some((p) => p.id === id);
      return {
        edits: withoutKey(prev.edits, id),
        reviews: withoutKey(prev.reviews, id),
        added: prev.added.filter((p) => p.id !== id),
        deleted: wasAdded ? prev.deleted : [...prev.deleted, id],
      };
    });

  const toggleVisible = (id) => {
    const current = products.find((p) => p.id === id);
    if (current) updateProduct(id, { visible: !current.visible });
  };

  // Saves a customer review on ONE product: { name, rating, text }. Newest first.
  const addReview = (id, review) =>
    setChanges((prev) => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [id]: [
          { id: Date.now(), name: review.name, rating: Number(review.rating), text: review.text },
          ...(prev.reviews[id] ?? []),
        ],
      },
    }));

  // Throw away every admin/customer change and show the JSON as it is
  const resetChanges = () => setChanges(NO_CHANGES);

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories,
        status,
        error,
        reload,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleVisible,
        addReview,
        resetChanges,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);