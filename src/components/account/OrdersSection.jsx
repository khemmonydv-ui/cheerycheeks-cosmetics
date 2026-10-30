import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { loadInvoices } from '../../api/shopApi';
import { useProducts } from '../../context/ProductsContext';
import { getOrdersFor } from '../../utils/orders';
import { methodLabel } from '../cart/PaymentMethod';
import { money } from '../cart/money';
import './OrdersSection.css';

const PAY_NAMES = { cash: 'Cash', qr: 'QR code' };
const paymentName = (m) => {
  const id = String(m ?? '').toLowerCase();
  return PAY_NAMES[id] ?? methodLabel(id);
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    timeZone: 'Asia/Phnom_Penh',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// "My orders" on the Account page. It joins two places:
//   1. orders this customer placed in the shop (localStorage, see utils/orders.js)
//   2. this customer's invoices in invoices.json (customerId = account id)
export default function OrdersSection({ user }) {
  const { products } = useProducts();
  const [saved] = useState(() => getOrdersFor(user.id));
  const [invoices, setInvoices] = useState(null); // null = still loading
  const { hash } = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    loadInvoices(controller.signal)
      .then(setInvoices)
      .catch((err) => {
        if (err.name !== 'AbortError') setInvoices([]); // the shop orders still show
      });
    return () => controller.abort();
  }, []);

  // /account#orders (from the "Thank you" page) scrolls to this section
  useEffect(() => {
    if (hash === '#orders') document.getElementById('orders')?.scrollIntoView?.();
  }, [hash]);

  const names = new Map(products.map((p) => [p.id, p.name]));

  const fromShop = saved.map((o) => ({
    key: `shop-${o.id}`,
    number: o.orderNumber,
    createdAt: o.createdAt,
    status: o.status,
    total: o.total,
    method: o.payments?.[0]?.method,
    items: o.items.map((i) => ({
      key: i.productId,
      name: i.name ?? names.get(i.productId) ?? `Product #${i.productId}`,
      quantity: i.quantity,
      lineTotal: i.lineTotal,
    })),
  }));

  const fromJson = (invoices ?? [])
    .filter((inv) => inv.customerId === user.id)
    .map((inv) => ({
      key: `inv-${inv.id}`,
      number: inv.invoiceNumber,
      createdAt: inv.createdAt,
      status: inv.status,
      total: inv.total,
      method: inv.payments?.[0]?.method,
      items: inv.items.map((i) => ({
        key: i.productId,
        name: names.get(i.productId) ?? `Product #${i.productId}`,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
    }));

  const orders = [...fromShop, ...fromJson].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <section id="orders" className="orders">
      <h2 className="orders-title">My orders</h2>

      {orders.length === 0 && invoices === null && <p className="orders-empty">Loading your orders...</p>}

      {orders.length === 0 && invoices !== null && (
        <div className="orders-empty">
          <p>You have no orders yet.</p>
          <Link to="/products" className="btn btn-primary btn-sm">Start shopping</Link>
        </div>
      )}

      <ul className="orders-list">
        {orders.map((o) => (
          <li key={o.key} className="order-card">
            <header className="order-head">
              <div>
                <p className="order-number">{o.number}</p>
                <p className="order-date">{formatDate(o.createdAt)}</p>
              </div>
              <span className={`order-status is-${String(o.status).toLowerCase()}`}>
                {String(o.status).charAt(0) + String(o.status).slice(1).toLowerCase()}
              </span>
            </header>

            <ul className="order-items">
              {o.items.map((i) => (
                <li key={i.key}>
                  <span>{i.name} × {i.quantity}</span>
                  <span>{money(i.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <footer className="order-foot">
              <span>Paid with {paymentName(o.method)}</span>
              <strong>Total {money(o.total)}</strong>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}