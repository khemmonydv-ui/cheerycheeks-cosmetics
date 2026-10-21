import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, total, setQty, removeFromCart, clearCart, toNumber } = useCart();

  if (items.length === 0) {
    return (
      <section className="cart">
        <h1>Your cart</h1>
        <p className="cart-empty">Your cart is empty.</p>
        <Link to="/products" className="cart-btn">Continue shopping</Link>
      </section>
    );
  }

  return (
    <section className="cart">
      <h1>Your cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <span className="cart-thumb">
              {item.image ? <img src={item.image} alt="" /> : null}
            </span>

            <div className="cart-info">
              <strong>{item.name}</strong>
              <span>${toNumber(item.price).toFixed(2)}</span>
            </div>

            <div className="cart-qty">
              <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease quantity">−</button>
              <span>{item.qty}</span>
              <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase quantity">+</button>
            </div>

            <strong className="cart-line-total">
              ${(toNumber(item.price) * item.qty).toFixed(2)}
            </strong>

            <button className="cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <button className="cart-link" onClick={clearCart}>Clear cart</button>
        <div className="cart-total">
          <span>Total</span>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>

      <div className="cart-actions">
        <Link to="/products" className="cart-btn is-outline">Continue shopping</Link>
        <button className="cart-btn" onClick={() => alert('Checkout is not built yet')}>Checkout</button>
      </div>
    </section>
  );
}