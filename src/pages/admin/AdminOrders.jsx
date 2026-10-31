import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  loadAllOrders,
  setOrderStatus,
  ORDERS_CHANGED,
  STATUSES,
  STATUS_LABEL,
} from '../../utils/adminOrders';
import { Modal, StatCard, StatusBadge, formatDate, money } from '../../components/admin/SalesUi';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState(null);

  const [error, setError] = useState('');

  // Load once, and again whenever an order changes (even from another tab)
  useEffect(() => {
    let cancelled = false;

    async function getOrders() {
      try {
        const list = await loadAllOrders();
        if (cancelled) return;
        setOrders(list);
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getOrders();
    window.addEventListener(ORDERS_CHANGED, getOrders);
    window.addEventListener('storage', getOrders);

    return () => {
      cancelled = true;
      window.removeEventListener(ORDERS_CHANGED, getOrders);
      window.removeEventListener('storage', getOrders);
    };
  }, []);

  const counts = useMemo(() => {
    const result = { all: orders.length };
    STATUSES.forEach((status) => {
      result[status] = orders.filter((o) => o.status === status).length;
    });
    return result;
  }, [orders]);

  const revenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const text = query.trim().toLowerCase();
  const visible = orders.filter((order) => {
    if (tab !== 'all' && order.status !== tab) return false;
    if (!text) return true;
    return [order.number, order.customerName, order.customerEmail, ...order.items.map((i) => i.name)]
      .join(' ')
      .toLowerCase()
      .includes(text);
  });

  const open = orders.find((order) => order.key === openKey);
  const closeModal = useCallback(() => setOpenKey(null), []);

  return (
    <section className="sales-page">
      <header className="sales-head">
        <h1>Orders</h1>
        <p>Every order placed on the website, newest first.</p>
      </header>

      <div className="sales-stats">
        <StatCard label="Total orders" value={counts.all} />
        <StatCard label="Pending" value={counts.pending} hint="Need your attention" />
        <StatCard label="Shipped" value={counts.shipped} />
        <StatCard label="Revenue" value={money(revenue)} hint="Without cancelled orders" />
      </div>

      <div className="sales-toolbar">
        <div className="sales-tabs" role="tablist" aria-label="Order status">
          {['all', ...STATUSES].map((status) => (
            <button
              key={status}
              type="button"
              role="tab"
              aria-selected={tab === status}
              className={tab === status ? 'is-active' : ''}
              onClick={() => setTab(status)}
            >
              {status === 'all' ? 'All' : STATUS_LABEL[status]}
              <span>{counts[status]}</span>
            </button>
          ))}
        </div>

        <input
          className="sales-search"
          type="search"
          placeholder="Search order, customer or product"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
      </div>

      {error && <p className="sales-empty" role="alert">{error}</p>}

      {loading ? (
        <p className="sales-empty">Loading orders...</p>
      ) : visible.length === 0 ? (
        <p className="sales-empty">
          {orders.length === 0 ? 'No orders yet. New orders will appear here.' : 'No orders match your search.'}
        </p>
      ) : (
        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.key}>
                  <td data-label="Order"><strong>{order.number}</strong></td>
                  <td data-label="Customer">
                    {order.customerName}
                    <small>{order.customerEmail}</small>
                  </td>
                  <td data-label="Date">{formatDate(order.createdAt)}</td>
                  <td data-label="Items">{order.items.reduce((sum, i) => sum + i.qty, 0)}</td>
                  <td data-label="Total"><strong>{money(order.total)}</strong></td>
                  <td data-label="Status"><StatusBadge status={order.status} /></td>
                  <td>
                    <button type="button" className="sales-btn" onClick={() => setOpenKey(order.key)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <Modal
          title={`Order ${open.number}`}
          subtitle={formatDate(open.createdAt, true)}
          onClose={closeModal}
        >
          <div className="sales-info">
            <div>
              <span>Customer</span>
              <strong>{open.customerName}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{open.customerEmail || '-'}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{open.customerPhone || '-'}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{open.address || '-'}</strong>
            </div>
          </div>

          <ul className="sales-lines">
            {open.items.map((line, index) => (
              <li key={`${line.productId}-${index}`}>
                <span className="sales-lines__pic">
                  {line.image ? <img src={line.image} alt="" /> : null}
                </span>
                <span className="sales-lines__name">
                  {line.name}
                  <small>{money(line.price)} x {line.qty}</small>
                </span>
                <strong>{money(line.price * line.qty)}</strong>
              </li>
            ))}
          </ul>

          <p className="sales-total">
            <span>Total</span>
            <strong>{money(open.total)}</strong>
          </p>

          <label className="sales-status-pick">
            Order status
            <select value={open.status} onChange={(e) => setOrderStatus(open, e.target.value)}>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{STATUS_LABEL[status]}</option>
              ))}
            </select>
          </label>
        </Modal>
      )}
    </section>
  );
}