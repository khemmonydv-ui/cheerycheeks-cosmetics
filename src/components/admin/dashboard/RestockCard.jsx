import { Link } from 'react-router-dom';
import StockBadge from '../StockBadge';

// products = the products that are low or out of stock (already sorted)
export default function RestockCard({ products }) {
  return (
    <section className="dash-card">
      <h2>Needs restocking</h2>

      {products.length === 0 ? (
        <p className="dash-empty">Everything is well stocked.</p>
      ) : (
        <ul className="dash-list">
          {products.map((p) => (
            <li key={p.id}>
              <span className="dash-thumb">{p.image ? <img src={p.image} alt="" /> : null}</span>
              <span className="dash-name">{p.name}</span>
              <StockBadge stock={p.stock} />
            </li>
          ))}
        </ul>
      )}

      <Link to="/admin/products" className="dash-btn">Manage products</Link>
    </section>
  );
}