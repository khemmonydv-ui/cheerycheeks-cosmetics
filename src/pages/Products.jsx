import { useState, useEffect, useCallback, useRef } from 'react';

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import SearchBar from '../components/product/SearchBar';
import FilterTabs from '../components/product/FilterTabs';
import SortSelect from '../components/product/SortSelect';
import ProductCard from '../components/product/ProductCard';
import ProductDetail from '../components/product/ProductDetail';
import LoginPrompt from '../components/common/LoginPrompt';

import { sortProducts } from '../utils/sortProducts';
import { getCurrentUser } from '../utils/session';

import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

import './Products.css';

// ==========================================
// LOADING SKELETON
// ==========================================

function SkeletonGrid() {
  return (
    <div className="grid" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="card card-skeleton">
          <div className="card-image skeleton-block" />

          <div className="card-body">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// PRODUCTS PAGE
// ==========================================

export default function Products() {
  // ========================================
  // 1. REACT ROUTER
  // ========================================

  const navigate = useNavigate();
  const location = useLocation();

  // Read search parameters from URL.
  // Example: /products?q=serum
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFromHeader = searchParams.get('q') || '';

  // ========================================
  // 2. STATE
  // ========================================

  const [jsonProducts, setJsonProducts] = useState([]);
  const [jsonCategories, setJsonCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [active, setActive] = useState('All');

  // Initialize search with the value from Header.
  const [query, setQuery] = useState(searchFromHeader);

  const [sort, setSort] = useState('featured');

  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('');
  const [promptFor, setPromptFor] = useState('');

  const noticeTimer = useRef(null);

  // ========================================
  // 3. CONTEXT
  // ========================================

  // Keep admin changes and customer reviews working.
  const {
    products: contextProducts,
    status: contextStatus,
    error: contextError,
    reload,
    addReview,
  } = useProducts();

  // Shared cart.
  const { items, addToCart } = useCart();

  // ========================================
  // 4. CONNECT HEADER SEARCH TO PRODUCTS
  // ========================================

  // When the Header changes ?q= in the URL,
  // update the Products page search input.
  useEffect(() => {
    setQuery(searchFromHeader);
  }, [searchFromHeader]);

  // Update the search box while the user types.
  const handleSearchChange = (value) => {
    setQuery(value);
  };

  // ========================================
  // 5. FETCH JSON USING ASYNC / AWAIT
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError('');

        // Both JSON files must be inside public/.
        const baseUrl = import.meta.env.BASE_URL;

        async function readJson(path) {
          const response = await fetch(`${baseUrl}${path}`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(
              `${path}: HTTP ${response.status}. Check the file location.`
            );
          }

          const contentType =
            response.headers.get('content-type') || '';

          if (!contentType.includes('json')) {
            throw new Error(
              `${path} returned HTML instead of JSON. Check the filename and public/ folder.`
            );
          }

          return await response.json();
        }

        // Fetch both files.
        const [productsData, categoriesData] = await Promise.all([
          readJson('products-data/products.json'),
          readJson('products-data/categories.json'),
        ]);

        if (
          !Array.isArray(productsData) ||
          !Array.isArray(categoriesData)
        ) {
          throw new Error('Both JSON files must contain arrays.');
        }

        // Save JSON data to React state.
        setJsonProducts(productsData);
        setJsonCategories(categoriesData);
      } catch (err) {
        if (err.name === 'AbortError') return;

        setError(err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      controller.abort();
    };
  }, [attempt]);

  // ========================================
  // 6. COMBINE JSON WITH SHARED PRODUCT DATA
  // ========================================

  // ProductsContext contains admin edits,
  // customer reviews, stock and sales information.

  const categoryById = new Map(
    jsonCategories.map((category) => [
      Number(category.id),
      category.name,
    ])
  );

  const productMap = new Map(
    contextProducts.map((product) => [
      Number(product.id),
      product,
    ])
  );

  const jsonIds = new Set(
    jsonProducts.map((product) => Number(product.id))
  );

  // Keep admin edits and reviews while retaining
  // images and other fields from JSON.
  const productsFromJson = jsonProducts.map((jsonProduct) => {
    const edited = productMap.get(Number(jsonProduct.id)) || {};

    const product = {
      ...jsonProduct,
      ...edited,
    };

    return {
      ...product,

      image:
        edited.image ||
        jsonProduct.image ||
        null,

      category:
        product.category ||
        categoryById.get(Number(product.categoryId)) ||
        'Beauty',

      visible:
        product.visible ??
        product.active ??
        true,
    };
  });

  // Include new products added through admin.
  const addedProducts = contextProducts
    .filter((product) => !jsonIds.has(Number(product.id)))
    .map((product) => ({
      ...product,

      category:
        product.category ||
        categoryById.get(Number(product.categoryId)) ||
        'Beauty',

      visible:
        product.visible ??
        product.active ??
        true,
    }));

  const products = [
    ...productsFromJson,
    ...addedProducts,
  ].filter((product) => product.visible);

  // ========================================
  // 7. CATEGORY NAMES
  // ========================================

  const categoryNames = [
    ...new Set([
      ...jsonCategories.map((category) => category.name),
      ...products.map((product) => product.category),
    ]),
  ].filter((name) =>
    products.some((product) => product.category === name)
  );

  // ========================================
  // 8. CATEGORY FILTER FROM HOME / ABOUT
  // ========================================

  // Example:
  // /products?category=skincare

  useEffect(() => {
    const requested = searchParams.get('category');

    if (!requested) {
      setActive('All');
      return;
    }

    const normalize = (value) =>
      value.toLowerCase().replace(/\s+/g, '');

    const match = jsonCategories.find(
      (category) =>
        normalize(category.name) === normalize(requested)
    );

    if (match) {
      setActive(match.name);
    } else {
      setActive('All');
    }
  }, [location.search, jsonCategories]);

  // ========================================
  // 9. SEARCH AND FILTER PRODUCTS
  // ========================================

  const searchText = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    // Filter by selected category.
    const matchCategory =
      active === 'All' ||
      product.category === active;

    // Filter by search text.
    const matchSearch = `
      ${product.name || ''}
      ${product.brand || ''}
      ${product.category || ''}
      ${product.sku || ''}
    `
      .toLowerCase()
      .includes(searchText);

    // Product must match both conditions.
    return matchCategory && matchSearch;
  });

  // ========================================
  // 10. SORT PRODUCTS
  // ========================================

  const visibleProducts = sortProducts(
    filteredProducts,
    sort
  );

  // ========================================
  // 11. SELECT PRODUCT DETAILS
  // ========================================

  const selected = products.find(
    (product) => product.id === selectedId
  );

  const closeDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  // ========================================
  // 12. CART
  // ========================================

  const inCart = new Map(
    items.map((item) => [
      item.id,
      item.qty,
    ])
  );

  const handleAddToCart = (product) => {
    // User must log in before adding to cart.
    if (!getCurrentUser()) {
      setPromptFor(product.name);
      return;
    }

    if (!addToCart(product)) return;

    setNotice(`${product.name} added to your cart`);

    clearTimeout(noticeTimer.current);

    noticeTimer.current = setTimeout(() => {
      setNotice('');
    }, 2200);
  };

  // ========================================
  // 13. LOGIN / SIGNUP
  // ========================================

  const closePrompt = useCallback(() => {
    setPromptFor('');
  }, []);

  const goTo = (path) => {
    setPromptFor('');

    navigate(path, {
      state: {
        from: location.pathname + location.search,
        notice:
          'Please log in or create an account to add products to your cart.',
      },
    });
  };

  // ========================================
  // 14. CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    // Reset local states.
    setActive('All');
    setQuery('');

    // Also remove q and category from URL.
    // This keeps the Header and Products search in sync.
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);

      next.delete('q');
      next.delete('category');

      return next;
    });
  };

  // ========================================
  // 15. RETRY FETCH
  // ========================================

  const handleRetry = () => {
    reload();
    setAttempt((previous) => previous + 1);
  };

  // ========================================
  // 16. CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      clearTimeout(noticeTimer.current);
    };
  }, []);

  // ========================================
  // 17. LOADING AND ERROR STATES
  // ========================================

  const isLoading =
    loading || contextStatus === 'loading';

  const loadError =
    error ||
    (contextStatus === 'error' ? contextError : '');

  const isReady =
    !isLoading && !loadError;

  // ========================================
  // 18. RETURN JSX
  // ========================================

  return (
    <section className="collection">

      {/* PAGE TITLE */}

      <h1 className="collection-title">
        Our Collection
      </h1>

      <p className="collection-subtitle">
        Thoughtfully made essentials for your daily ritual.
      </p>

      {/* SEARCH BAR */}

      <SearchBar
        value={query}
        onChange={handleSearchChange}
      />

      {/* FILTER AND SORT */}

      <div className="collection-toolbar">

        {/* LEFT: CATEGORY FILTER */}

        <FilterTabs
          categories={['All', ...categoryNames]}
          active={active}
          onChange={setActive}
        />

        {/* RIGHT: SORT BY */}

        <SortSelect
          value={sort}
          onChange={setSort}
        />

      </div>

      {/* ====================================
          LOADING
      ==================================== */}

      {isLoading && (
        <SkeletonGrid />
      )}

      {/* ====================================
          ERROR
      ==================================== */}

      {!isLoading && loadError && (
        <div className="state-box" role="alert">

          <p className="state-title">
            We couldn't load the products.
          </p>

          <p className="state-text">
            {loadError}
          </p>

          <button
            type="button"
            className="state-btn"
            onClick={handleRetry}
          >
            Try again
          </button>

        </div>
      )}

      {/* ====================================
          DISPLAY PRODUCTS
      ==================================== */}

      {isReady && (
        <>

          {visibleProducts.length === 0 ? (
            <div className="state-box">

              <p className="state-title">
                No products found.
              </p>

              <p className="state-text">
                Try a different search or category.
              </p>

              <button
                type="button"
                className="state-btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>

            </div>
          ) : (
            <div className="grid">

              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inCart={inCart.get(product.id) ?? 0}
                  onAddToCart={handleAddToCart}
                  onSelect={setSelectedId}
                />
              ))}

            </div>
          )}

          {/* PRODUCT COUNT */}

          <p className="collection-count">
            Showing {visibleProducts.length}{' '}
            {visibleProducts.length === 1
              ? 'essential'
              : 'essentials'}
          </p>

        </>
      )}

      {/* ====================================
          PRODUCT DETAIL MODAL
      ==================================== */}

      {selected && (
        <ProductDetail
          key={selected.id}
          product={selected}
          inCart={inCart.get(selected.id) ?? 0}
          onClose={closeDetail}
          onAddToCart={handleAddToCart}
          onAddReview={addReview}
        />
      )}

      {/* ====================================
          LOGIN PROMPT
      ==================================== */}

      {promptFor && (
        <LoginPrompt
          productName={promptFor}
          onLogin={() => goTo('/login')}
          onSignup={() => goTo('/signup')}
          onClose={closePrompt}
        />
      )}

      {/* ====================================
          CART NOTIFICATION
      ==================================== */}

      <div
        className={notice ? 'toast show' : 'toast'}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>

    </section>
  );
}