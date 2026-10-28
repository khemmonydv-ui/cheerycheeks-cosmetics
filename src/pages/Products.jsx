// src/pages/Products.jsx
import { useState, useCallback, useEffect, useRef } from 'react';
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
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedId, setSelectedId] = useState(null); // the product being viewed
  const [notice, setNotice] = useState('');
  const [promptFor, setPromptFor] = useState(''); // product name while the "please log in" alert is open
  const noticeTimer = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // The shared list from products.json (the same one the admin page edits)
  const { products: allProducts, categories, status, error, reload, addReview } = useProducts();

  // The shared cart (the same one the header and /cart page read)
  const { items, addToCart } = useCart();

  // How many of each product are already in the cart: productId -> qty
  const inCart = new Map(items.map((i) => [i.id, i.qty]));

  // Customers only see products that are not hidden (active: false in the JSON)
  const products = allProducts.filter((p) => p.visible);

  // Only show category pills that have something to show
  const categoryNames = categories
    .map((c) => c.name)
    .filter((name) => products.some((p) => p.category === name));

  const searchText = query.trim().toLowerCase();
  const visible = sortProducts(
    products.filter((p) => {
      const matchCategory = active === 'All' || p.category === active;
      const matchSearch = `${p.name} ${p.brand} ${p.category} ${p.sku}`
        .toLowerCase()
        .includes(searchText);
      return matchCategory && matchSearch;
    }),
    sort
  );

  const selected = products.find((p) => p.id === selectedId);
  const closeDetail = useCallback(() => setSelectedId(null), []);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const handleAddToCart = (product) => {
    // No account yet: show the alert instead of adding
    if (!getCurrentUser()) {
      setPromptFor(product.name);
      return;
    }
    if (!addToCart(product)) return;
    setNotice(`${product.name} added to your cart`);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(''), 2200);
  };

  const closePrompt = useCallback(() => setPromptFor(''), []);

  // Go to /login or /signup, and come back to this page afterwards
  const goTo = (path) => {
    setPromptFor('');
    navigate(path, {
      state: {
        from: location.pathname + location.search,
        notice: 'Please log in or create an account to add products to your cart.',
      },
    });
  };

  const clearFilters = () => {
    setActive('All');
    setQuery('');
  };

  return (
    <section className="collection">
      <h1 className="collection-title">Our Collection</h1>
      <p className="collection-subtitle">
        Thoughtfully made essentials for your daily ritual.
      </p>

      <SearchBar value={query} onChange={setQuery} />
      <FilterTabs categories={['All', ...categoryNames]} active={active} onChange={setActive} />
      <SortSelect value={sort} onChange={setSort} />

      {status === 'loading' && <SkeletonGrid />}

      {status === 'error' && (
        <div className="state-box" role="alert">
          <p className="state-title">We couldn’t load the products.</p>
          <p className="state-text">{error}</p>
          <button className="state-btn" onClick={reload}>Try again</button>
        </div>
      )}

      {status === 'ready' && (
        <>
          {visible.length === 0 ? (
            <div className="state-box">
              <p className="state-title">No products found.</p>
              <p className="state-text">Try a different search or category.</p>
              <button className="state-btn" onClick={clearFilters}>Clear filters</button>
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
            Showing {active === 'All' && searchText === '' ? 'all ' : ''}
            {visible.length} {visible.length === 1 ? 'essential' : 'essentials'}
          </p>
        </>
      )}

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

      {promptFor && (
        <LoginPrompt
          productName={promptFor}
          onLogin={() => goTo('/login')}
          onSignup={() => goTo('/signup')}
          onClose={closePrompt}
        />
      )}

      {/* Small message that tells screen readers and sighted users the cart changed */}
      <div className={notice ? 'toast show' : 'toast'} role="status" aria-live="polite">
        {notice}
      </div>
    </section>
  );
}

export default Product;