import { Minus, Plus } from 'lucide-react';
import { money } from './money';

export default function CartItem({ item, linePrice, onQty, onRemove }) {
  return (
    <li className="cart-item">
      <span className="cart-item-img">
        {item.image ? <img src={item.image} alt="" /> : null}
      </span>

      <div className="cart-item-info">
        <span className="cart-item-cat">{item.category}</span>
        <strong className="cart-item-name">{item.name}</strong>
        {/* Only shown if the product has a "variant" field, e.g. "30 ml · Original" */}
        {item.variant && (
          <span className="cart-item-variant">
            <i aria-hidden="true" />
            {item.variant}
          </span>
        )}
      </div>

      <div className="cart-item-side">
        <strong className="cart-item-price">{money(linePrice)}</strong>

        <div className="cart-qty">
          <button
            type="button"
            onClick={() => onQty(item.id, item.qty - 1)}
            disabled={item.qty <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            <Minus size={14} aria-hidden="true" />
          </button>
          <span aria-live="polite">{item.qty}</span>
          <button
            type="button"
            onClick={() => onQty(item.id, item.qty + 1)}
            disabled={item.qty >= item.stock}
            aria-label={`Increase quantity of ${item.name}`}
          >
            <Plus size={14} aria-hidden="true" />
          </button>
        </div>

        <button type="button" className="cart-remove" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </li>
  );
}