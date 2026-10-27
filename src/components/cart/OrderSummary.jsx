import { money } from './money';

export default function OrderSummary({
  subtotal, discount, shipping, tax, total,
  promo, onPromoChange, onApplyPromo, promoMessage,
  onPlaceOrder,
}) {
  return (
    <aside className="cart-card cart-summary">
      <h2>Order summary</h2>

      <dl className="cart-rows">
        <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
        <div>
          <dt>Discount</dt>
          <dd className="is-green">{discount > 0 ? `−${money(discount)}` : money(0)}</dd>
        </div>
        <div><dt>Shipping</dt><dd>{money(shipping)}</dd></div>
        <div><dt>Tax (10%)</dt><dd>{money(tax)}</dd></div>
      </dl>

      <form
        className="cart-promo"
        onSubmit={(e) => {
          e.preventDefault();
          onApplyPromo();
        }}
      >
        <input
          type="text"
          placeholder="Promo code"
          aria-label="Promo code"
          value={promo}
          onChange={(e) => onPromoChange(e.target.value)}
        />
        <button type="submit" className="cart-apply">Apply</button>
      </form>
      <p className={`cart-promo-msg ${promoMessage.type ? `is-${promoMessage.type}` : ''}`}>
        {promoMessage.text}
      </p>

      <div className="cart-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>

      <button type="button" className="cart-place" onClick={onPlaceOrder}>
        Place Order
      </button>
    </aside>
  );
}