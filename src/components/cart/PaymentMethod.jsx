import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { money } from './money';

// Logo files live in  public/payments/  (the browser reads them as /payments/...)
const METHODS = [
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'aba', label: 'ABA', logo: '/payments/aba.png' },
  { id: 'acleda', label: 'ACLEDA', logo: '/payments/aceleda.jpeg' },
  { id: 'phillip', label: 'PhillipBank', logo: '/payments/phillib.png' },
];

// Shows the bank image, or the bank name as text if the image file is missing
function BankLogo({ method }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <span className="pay-logo">{method.label}</span>;

  return (
    <img
      className="pay-logo-img"
      src={method.logo}
      alt="" /* the button already has an aria-label */
      onError={() => setFailed(true)}
    />
  );
}

export const methodLabel = (id) => METHODS.find((m) => m.id === id)?.label ?? id;

function Field({ label, error, children }) {
  return (
    <label className="pay-field">
      <span>{label}</span>
      {children}
      {error && <small className="pay-error">{error}</small>}
    </label>
  );
}

export default function PaymentMethod({
  method, onMethodChange,
  card, onCardChange, errors,
  saveCard, onSaveCardChange,
  total, onPlaceOrder,
}) {
  return (
    <form
      className="cart-card cart-pay"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onPlaceOrder();
      }}
    >
      <h2>Payment method</h2>

      <div className="pay-methods" role="radiogroup" aria-label="Payment method">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={method === m.id}
            aria-label={m.label}
            className={`pay-tile is-${m.id} ${m.logo ? 'has-logo' : ''} ${method === m.id ? 'is-selected' : ''}`}
            onClick={() => onMethodChange(m.id)}
          >
            {m.id === 'card' ? (
              <>
                <CreditCard size={22} aria-hidden="true" />
                <span>Credit / Debit Card</span>
              </>
            ) : (
              <BankLogo method={m} />
            )}
          </button>
        ))}
      </div>

      {method === 'card' ? (
        <>
          <Field label="Cardholder name" error={errors.name}>
            <input
              type="text"
              placeholder="Name on card"
              autoComplete="cc-name"
              value={card.name}
              onChange={(e) => onCardChange('name', e.target.value)}
            />
          </Field>

          <Field label="Card number" error={errors.number}>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              autoComplete="cc-number"
              value={card.number}
              onChange={(e) => onCardChange('number', e.target.value)}
            />
          </Field>

          <div className="pay-row">
            <Field label="Expiry date" error={errors.expiry}>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM / YY"
                autoComplete="cc-exp"
                value={card.expiry}
                onChange={(e) => onCardChange('expiry', e.target.value)}
              />
            </Field>
            <Field label="CVV" error={errors.cvv}>
              <input
                type="password"
                inputMode="numeric"
                placeholder="123"
                autoComplete="cc-csc"
                value={card.cvv}
                onChange={(e) => onCardChange('cvv', e.target.value)}
              />
            </Field>
          </div>

          <label className="pay-check">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => onSaveCardChange(e.target.checked)}
            />
            Save this card for faster checkout next time
          </label>
        </>
      ) : (
        <p className="pay-note">
          You will finish this payment with {methodLabel(method)} after placing your order.
        </p>
      )}

      <hr className="pay-divider" />

      <button type="submit" className="cart-place">
        Place Order&nbsp;&nbsp;{money(total)}
      </button>

      <p className="pay-terms">
        By placing your order, you agree to our <a href="/terms">Terms &amp; Conditions</a> and{' '}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}