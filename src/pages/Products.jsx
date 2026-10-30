
// src/pages/Products.jsx

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import SearchBar from '../components/product/SearchBar';
import FilterTabs from '../components/product/FilterTabs';
import SortSelect from '../components/product/SortSelect';
import ProductCard from '../components/product/ProductCard';
import ProductDetail from '../components/product/ProductDetail';

import { sortProducts } from '../utils/sortProducts';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

// Grey placeholder cards shown while the JSON is loading
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

function Product() {
  // Read and update category information in the URL
  const [searchParams, setSearchParams] = useSearchParams();

  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedId, setSelectedId] = useState(null);
  const [notice, setNotice] = useState('');

  const noticeTimer = useRef(null);

  // Products and categories from JSON
  const {
    products: allProducts,
    categories,
    status,
    error,
    reload,
    addReview,
  } = useProducts();

  // Shared shopping cart
  const { items, addToCart } = useCart();

  // Count how many of each product are already in the cart
  const inCart = new Map(items.map((i) => [i.id, i.qty]));

  // Only show products that are visible
  const products = allProducts.filter((p) => p.visible);

  // Get category names from JSON categories
  // Only show categories that have visible products
  const categoryNames = useMemo(() => {
    return categories
      .map((category) => category.name)
      .filter((name) =>
        products.some((product) => product.category === name)
      );
  }, [categories, allProducts]);

  // Make category names easier to compare
  // Example: "Body Care" becomes "bodycare"
  const normalizeCategory = (name) => {
    return name.toLowerCase().replace(/[\s_-]+/g, '');
  };

  // Sync category filter with URL
  useEffect(() => {
    const urlCategory = searchParams.get('category');

    // No category in URL means show all products
    if (!urlCategory) {
      setActive('All');
      return;
    }

    // Find the real category name from JSON
    const matchedCategory = categoryNames.find(
      (name) =>
        normalizeCategory(name) === normalizeCategory(urlCategory)
    );

    // Select the matching category
    setActive(matchedCategory || 'All');
  }, [searchParams, categoryNames]);

  // Handle clicking a category tab
  const handleCategoryChange = (category) => {
    setActive(category);

    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({
        category: normalizeCategory(category),
      });
    }
  };

  // Clear search and category filters
  const clearFilters = () => {
    setActive('All');
    setQuery('');
    setSearchParams({});
  };

  // Handle adding a product to the cart
  const handleAddToCart = (product) => {
    if (!addToCart(product)) return;

    setNotice(`${product.name} added to your cart`);

    clearTimeout(noticeTimer.current);

    noticeTimer.current = setTimeout(() => {
      setNotice('');
    }, 2200);
  };

  // Clear timer when component is removed
  useEffect(() => {
    return () => clearTimeout(noticeTimer.current);
  }, []);

  // Search products
  const searchText = query.trim().toLowerCase();

  // Filter and sort products
  const visible = sortProducts(
    products.filter((product) => {
      const matchCategory =
        active === 'All' || product.category === active;

      const matchSearch = `${product.name} ${product.brand} ${product.category} ${product.sku}`
        .toLowerCase()
        .includes(searchText);

      return matchCategory && matchSearch;
    }),
    sort
  );

  // Find selected product for the detail modal
  const selected = products.find((p) => p.id === selectedId);

  const closeDetail = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <section className="collection">
      <h1 className="collection-title">Our Collection</h1>

      <p className="collection-subtitle">
        Thoughtfully made essentials for your daily ritual.
      </p>

      {/* Search */}
      <SearchBar
        value={query}
        onChange={setQuery}
      />

      {/* Category filters */}
      <FilterTabs
        categories={['All', ...categoryNames]}
        active={active}
        onChange={handleCategoryChange}
      />

      {/* Sort products */}
      <SortSelect
        value={sort}
        onChange={setSort}
      />

      {/* Loading state */}
      {status === 'loading' && <SkeletonGrid />}

      {/* Error state */}
      {status === 'error' && (
        <div className="state-box" role="alert">
          <p className="state-title">
            We couldn’t load the products.
          </p>

          <p className="state-text">
            {error}
          </p>

          <button
            className="state-btn"
            onClick={reload}
          >
            Try again
          </button>
        </div>
      )}

      {/* Products loaded successfully */}
      {status === 'ready' && (
        <>
          {visible.length === 0 ? (
            <div className="state-box">
              <p className="state-title">
                No products found.
              </p>

              <p className="state-text">
                Try a different search or category.
              </p>

              <button
                className="state-btn"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid">
              {visible.map((product) => (
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

          <p className="collection-count">
            {active === 'All' && searchText === '' ? 'Showing all ' : 'Showing '}
            {visible.length}{' '}
            {visible.length === 1 ? 'essential' : 'essentials'}
          </p>
        </>
      )}

      {/* Product detail modal */}
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

      {/* Cart notification */}
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

export default Product;
