import { useState } from 'react';
import FilterTabs from './FilterTabs';
import ProductCard from './ProductCard';
import { categories, products } from '../../data/products';

function Collection() {
  const [active, setActive] = useState('All');

  const visible =
    active === 'All' ? products : products.filter((p) => p.category === active);

  const handleAddToCart = (product) => {
    alert(`${product.name} added to cart`);
  };

  return (
    <section className="collection">
      <h1 className="collection-title">Our Collection</h1>
      <p className="collection-subtitle">
        Thoughtfully made essentials for your daily ritual.
      </p>

      <FilterTabs categories={categories} active={active} onChange={setActive} />

      <div className="grid">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <p className="collection-count">
        Showing {active === 'All' ? 'all ' : ''}
        {visible.length} essentials
      </p>
    </section>
  );
}

export default Collection;