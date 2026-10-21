const STEPS = ['Cart', 'Checkout', 'Payment', 'Confirmation'];

// current = 1..4, steps up to the current one are filled in
export default function CartStepper({ current = 1 }) {
  return (
    <ol className="cart-stepper" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? 'is-done' : n === current ? 'is-current' : '';
        return (
          <li key={label} className={`cart-step ${state}`} aria-current={n === current ? 'step' : undefined}>
            <span className="cart-step-dot">{n}</span>
            <span className="cart-step-label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}