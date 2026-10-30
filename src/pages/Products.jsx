import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
// PRODUCT PAGE
// ==========================================

export default function Products() {

  // ========================================
  // 1. STATE
  // ========================================

  const [jsonProducts, setJsonProducts] = useState([]);
  const [jsonCategories, setJsonCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('');
  const [promptFor, setPromptFor] = useState('');

  const noticeTimer = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Keep admin changes and customer reviews working
  const {
    products: contextProducts,
    status: contextStatus,
    error: contextError,
    reload,
    addReview,
  } = useProducts();

  // Shared cart
  const { items, addToCart } = useCart();

  // ========================================
  // 2. FETCH JSON USING ASYNC / AWAIT
  // ========================================

  useEffect(() => {

    const controller = new AbortController();

    async function fetchProducts() {

      try {

        setLoading(true);
        setError('');

        // Fetch both related JSON files
        const baseUrl = import.meta.env.BASE_URL;

        const productsResponse = await fetch(
          `${baseUrl}products-data/products.json`,
          { signal: controller.signal }
        );

        const categoriesResponse = await fetch(
          `${baseUrl}products-data/categories.json`,
          { signal: controller.signal }
        );

        // Check responses
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products.json');
        }

        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories.json');
        }

        // Convert JSON into JavaScript arrays
        const productsData = await productsResponse.json();

        const categoriesData = await categoriesResponse.json();

        if (
          !Array.isArray(productsData) ||
          !Array.isArray(categoriesData)
        ) {
          throw new Error('Invalid JSON data format');
        }

        // Save data to React state
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
  // 3. COMBINE JSON WITH SHARED PRODUCT DATA
  // ========================================

  // ProductsContext contains admin edits,
  // customer reviews, stock and sales information.

  const productMap = new Map(
    contextProducts.map((product) => [
      product.id,
      product,
    ])
  );

  const jsonIds = new Set(
    jsonProducts.map((product) => product.id)
  );

  // Match products.json IDs with live product data
  const productsFromJson = jsonProducts
    .map((product) => productMap.get(product.id))
    .filter(Boolean);

  // Include products created by the admin
  const addedProducts = contextProducts.filter(
    (product) => !jsonIds.has(product.id)
  );

  // Only visible products
  const products = [
    ...productsFromJson,
    ...addedProducts,
  ].filter((product) => product.visible);


  // ========================================
  // 4. GET CATEGORIES
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
  // 5. SEARCH AND FILTER PRODUCTS
  // ========================================

  const searchText = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {

    const matchCategory =
      active === 'All' ||
      product.category === active;

    const matchSearch = `
      ${product.name}
      ${product.brand}
      ${product.category}
      ${product.sku}
    `
      .toLowerCase()
      .includes(searchText);

    return matchCategory && matchSearch;

  });


  // ========================================
  // 6. SORT PRODUCTS
  // ========================================

  const visibleProducts = sortProducts(
    filteredProducts,
    sort
  );


  // ========================================
  // 7. SELECT PRODUCT DETAILS
  // ========================================

  const selected = products.find(
    (product) => product.id === selectedId
  );

  const closeDetail = useCallback(() => {
    setSelectedId(null);
  }, []);


  // ========================================
  // 8. CART
  // ========================================

  const inCart = new Map(
    items.map((item) => [
      item.id,
      item.qty,
    ])
  );

  const handleAddToCart = (product) => {

    // User must log in before adding to cart
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
  // 9. LOGIN / SIGNUP
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
  // 10. CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setActive('All');
    setQuery('');
  };


  // ========================================
  // 11. RETRY FETCH
  // ========================================

  const handleRetry = () => {
    reload();
    setAttempt((previous) => previous + 1);
  };


  // ========================================
  // 12. CLEANUP
  // ========================================

  useEffect(() => {
    return () => {
      clearTimeout(noticeTimer.current);
    };
  }, []);


  // ========================================
  // 13. LOADING AND ERROR STATES
  // ========================================

  const isLoading =
    loading || contextStatus === 'loading';

  const loadError =
    error ||
    (contextStatus === 'error' ? contextError : '');

  const isReady =
    !isLoading && !loadError;


  // ========================================
  // 14. RETURN JSX
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
        onChange={setQuery}
      />


      {/* CATEGORY FILTER */}

      <FilterTabs
        categories={['All', ...categoryNames]}
        active={active}
        onChange={setActive}
      />


      {/* SORT PRODUCTS */}

      <SortSelect
        value={sort}
        onChange={setSort}
      />


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

            Showing {visibleProducts.length}

            {' '}

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