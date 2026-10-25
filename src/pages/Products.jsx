// src/pages/Products.jsx
import { useState } from 'react';
import SearchBar from '../components/product/SearchBar';
import FilterTabs from '../components/product/FilterTabs';
import ProductCard from '../components/product/ProductCard';
import ProductDetail from '../components/product/ProductDetail';
import { categories } from '../data/products';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';

function Product() {
  const [active, setActive] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null); // the product being viewed

  // Read the shared list (the same one the admin page edits)
  const { products: allProducts } = useProducts();

  // The shared cart (the same one the header and /cart page read)
  const { addToCart } = useCart();

  // Customers only see products that are not hidden
  const products = allProducts.filter((p) => p.visible);

  const visible = products.filter((p) => {
    const matchCategory = active === 'All' || p.category === active;
    const matchSearch = `${p.name} ${p.category}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <section className="collection">
      <h1 className="collection-title">Our Collection</h1>
      <p className="collection-subtitle">
        Thoughtfully made essentials for your daily ritual.
      </p>

      <SearchBar value={query} onChange={setQuery} />
      <FilterTabs categories={categories} active={active} onChange={setActive} />

      <div className="grid">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onSelect={setSelected}
          />
        ))}
      </div>

      <p className="collection-count">
        Showing {active === 'All' && query === '' ? 'all ' : ''}
        {visible.length} essentials
      </p>

      {selected && (
        <ProductDetail
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </section>
  );
}

export default Product;