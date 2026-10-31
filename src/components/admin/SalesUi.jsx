import { useEffect } from 'react';
import { STATUS_LABEL } from '../../utils/adminOrders';
import './SalesPages.css';

export const money = (value) => `$${Number(value || 0).toFixed(2).replace(/\.00$/, '')}`;

export function formatDate(value, withTime = false) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export const initials = (name) =>
  String(name || '?')
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function StatCard({ label, value, hint }) {
  return (
    <div className="sales-stat">
      <span className="sales-stat__label">{label}</span>
      <strong className="sales-stat__value">{value}</strong>
      {hint && <span className="sales-stat__hint">{hint}</span>}
    </div>
  );
}

export function StatusBadge({ status }) {
  return <span className={`sales-badge sales-badge--${status}`}>{STATUS_LABEL[status] || status}</span>;
}

/** Pop-up: closes with the X, a click outside, or Esc */
export function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    const previous = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="sales-overlay" onClick={onClose}>
      <div
        className="sales-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sales-modal__head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="sales-modal__close" aria-label="Close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="sales-modal__body">{children}</div>
      </div>
    </div>
  );
}