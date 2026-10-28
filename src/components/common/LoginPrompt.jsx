import { useEffect, useRef } from 'react';
import './LoginPrompt.css';

// The alert shown when someone without an account presses "Add to cart".
//   onLogin  = go to the login page
//   onSignup = go to the sign up page
//   onClose  = stay on the page
export default function LoginPrompt({ productName, onLogin, onSignup, onClose }) {
  const loginButton = useRef(null);

  // Keyboard users land on the main button. Escape closes only this alert
  // (the capture listener stops Escape from also closing the product panel behind it).
  useEffect(() => {
    loginButton.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  return (
    <div className="prompt-overlay" onClick={onClose}>
      <div
        className="prompt"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="prompt-title"
        aria-describedby="prompt-text"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="prompt-title" className="prompt-title">Please log in first</h2>
        <p id="prompt-text" className="prompt-text">
          You need an account to add <strong>{productName}</strong> to your cart.
          Log in, or create an account if you don’t have one yet.
        </p>
        <div className="prompt-actions">
          <button ref={loginButton} className="prompt-btn prompt-btn-main" onClick={onLogin}>
            Log in
          </button>
          <button className="prompt-btn" onClick={onSignup}>Create an account</button>
          <button className="prompt-link" onClick={onClose}>Not now</button>
        </div>
      </div>
    </div>
  );
}