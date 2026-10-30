import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartStepper from '../../components/cart/CartStepper';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import PaymentMethod from '../../components/cart/PaymentMethod';
import { money } from '../../components/cart/money';
import { getCurrentUser } from '../../utils/session';
import { saveOrder } from '../../utils/orders';
import './Cart.css';

const SHIPPING = 2; // flat shipping, free when the cart is empty
const TAX_RATE = 0.02;
const PROMOS = { GLOW10: 0.1 }; // code -> discount rate
const emptyCard = { name: '', number: '', expiry: '', cvv: '' };
const makeOrderNumber = () => `CC-${Date.now().toString().slice(-6)}`;
const round2 = (n) => Math.round(n * 100) / 100;

// Turn what the person types into a neat value
const formatters = {
  name: (v) => v,
  number: (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim(),
  expiry: (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  },
  cvv: (v) => v.replace(/\D/g, '').slice(0, 4),
};

function validateCard(card) {
  const errors = {};
  if (card.name.trim().length < 2) errors.name = 'Enter the name on the card.';

  if (!/^\d{13,19}$/.test(card.number.replace(/\s/g, ''))) {
    errors.number = 'Enter a valid card number.';
  }

  const m = card.expiry.match(/^(\d{2}) \/ (\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    errors.expiry = 'Use the format MM / YY.';
  } else if (new Date(2000 + Number(m[2]), Number(m[1]), 1) <= new Date()) {
    errors.expiry = 'This card has expired.';
  }

  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = 'Enter the 3 or 4 digit code.';
  return errors;
}

export default function Cart() {
  const { items, total: subtotal, cartCount, setQty, removeFromCart, clearCart, toNumber } = useCart();

  const [promo, setPromo] = useState('');
  const [applied, setApplied] = useState(null); // { code, rate }
  const [promoMessage, setPromoMessage] = useState({ type: '', text: 'Try GLOW10 for 10% off.' });

  const [method, setMethod] = useState('card');
  const [card, setCard] = useState(emptyCard);
  const [saveCard, setSaveCard] = useState(false); // visual only, nothing is stored
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const [placeError, setPlaceError] = useState('');
  const navigate = useNavigate();
  const paymentRef = useRef(null);

  // ----- Totals -----
  const discount = applied ? subtotal * applied.rate : 0;
  const shipping = items.length > 0 ? SHIPPING : 0;
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + shipping + tax;

  // ----- Handlers -----
  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (PROMOS[code]) {
      setApplied({ code, rate: PROMOS[code] });
      setPromoMessage({ type: 'ok', text: `${code} applied: ${PROMOS[code] * 100}% off.` });
    } else {
      setApplied(null);
      setPromoMessage({ type: 'error', text: 'That code is not valid.' });
    }
  };

  const handleCardChange = (field, value) => {
    setCard((prev) => ({ ...prev, [field]: formatters[field](value) }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const scrollToPayment = () =>
    paymentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    // An order belongs to an account, so a visitor must log in first
    const user = getCurrentUser();
    if (!user) {
      navigate('/login', {
        state: { from: '/cart', notice: 'Please log in to place your order.' },
      });
      return;
    }

    if (method === 'card') {
      const found = validateCard(card);
      setErrors(found);
      if (Object.keys(found).length > 0) {
        scrollToPayment();
        return;
      }
    }

    // Save the order BEFORE the cart is cleared, so it shows in Account > My orders.
    // Demo only: no real payment is taken and card details are never stored.
    const number = makeOrderNumber();
    const lines = items.map((item) => {
      const unitPrice = toNumber(item.price);
      return {
        productId: item.id,
        name: item.name,
        quantity: item.qty,
        unitPrice,
        lineTotal: round2(unitPrice * item.qty),
      };
    });

    const saved = saveOrder({
      id: Date.now(),
      orderNumber: number,
      createdAt: new Date().toISOString(),
      customerId: user.id,
      customerEmail: user.email,
      status: 'PAID',
      currency: 'USD',
      items: lines,
      subtotal: round2(subtotal),
      discount: round2(discount),
      shipping: round2(shipping),
      tax: round2(tax),
      total: round2(total),
      payments: [{ method, amount: round2(total) }],
    });

    if (!saved) {
      setPlaceError('We could not save your order. Please try again.');
      return;
    }

    setPlaceError('');
    setOrder({ number, total, method });
    setCard(emptyCard);
    clearCart();
  };

  // ----- Order placed -----
  if (order) {
    return (
      <div className="cart-page">
        <div className="cart-inner">
          <h1 className="cart-title">Thank you!</h1>
          <CartStepper current={4} />
          <div className="cart-card cart-done">
            <p>
              Your order <strong>{order.number}</strong> has been placed.
            </p>
            <p className="cart-done-total">{money(order.total)}</p>
            <p>You can see this order in My orders.</p>
            <Link to="/account#orders" className="cart-place cart-place--link">View my orders</Link>
            <Link to="/products" className="cart-place cart-place--link">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- Empty cart -----
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-inner">
          <h1 className="cart-title">Your Cart</h1>
          <CartStepper current={1} />
          <div className="cart-card cart-done">
            <p>Your bag is empty.</p>
            <Link to="/products" className="cart-place cart-place--link">Continue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  // ----- Normal cart -----
  return (
    <div className="cart-page">
      <div className="cart-inner">
        <h1 className="cart-title">Your Cart</h1>
        <CartStepper current={1} />
        {placeError && <p className="cart-place-error" role="alert">{placeError}</p>}

        <div className="cart-grid">
          <section className="cart-card cart-bag cart-area-bag">
            <header className="cart-bag-head">
              <h2>Bag</h2>
              <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
            </header>

            <ul className="cart-list">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  linePrice={toNumber(item.price) * item.qty}
                  onQty={setQty}
                  onRemove={removeFromCart}
                />
              ))}
            </ul>
          </section>

          <div className="cart-area-summary">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              tax={tax}
              total={total}
              promo={promo}
              onPromoChange={setPromo}
              onApplyPromo={handleApplyPromo}
              promoMessage={promoMessage}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>

          <div className="cart-area-pay" ref={paymentRef}>
            <PaymentMethod
              method={method}
              onMethodChange={setMethod}
              card={card}
              onCardChange={handleCardChange}
              errors={errors}
              saveCard={saveCard}
              onSaveCardChange={setSaveCard}
              total={total}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}