import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadAllOrders, ORDERS_CHANGED } from '../../utils/adminOrders';
import { loadCustomers, toggleBlocked, CUSTOMERS_CHANGED } from '../../utils/customers';
import { Modal, StatCard, StatusBadge, formatDate, initials, money } from '../../components/admin/SalesUi';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState(null);

  const [error, setError] = useState('');

  // Load once, and again when a customer signs up, orders change, or someone is blocked
  useEffect(() => {
    let cancelled = false;

    async function getCustomers() {
      try {
        const orders = await loadAllOrders();
        const list = await loadCustomers(orders);
        if (cancelled) return;
        setCustomers(list);
        setError('');
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const events = [ORDERS_CHANGED, CUSTOMERS_CHANGED, 'storage'];
    getCustomers();
    events.forEach((name) => window.addEventListener(name, getCustomers));

    return () => {
      cancelled = true;
      events.forEach((name) => window.removeEventListener(name, getCustomers));
    };
  }, []);

  const stats = useMemo(
    () => ({
      all: customers.length,
      buyers: customers.filter((c) => c.orderCount > 0).length,
      blocked: customers.filter((c) => c.blocked).length,
      spent: customers.reduce((sum, c) => sum + c.spent, 0),
    }),
    [customers]
  );

  const text = query.trim().toLowerCase();
  const visible = customers.filter((customer) => {
    if (tab === 'buyers' && customer.orderCount === 0) return false;
    if (tab === 'blocked' && !customer.blocked) return false;
    if (!text) return true;
    return [customer.name, customer.email, customer.phone].join(' ').toLowerCase().includes(text);
  });

  const open = customers.find((customer) => customer.key === openKey);
  const closeModal = useCallback(() => setOpenKey(null), []);

  const tabs = [
    ['all', 'All', stats.all],
    ['buyers', 'With orders', stats.buyers],
    ['blocked', 'Blocked', stats.blocked],
  ];

  return (
    <section className="sales-page">
      <header className="sales-head">
        <h1>Customers</h1>
        <p>Everyone who created an account, with what they bought.</p>
      </header>

      <div className="sales-stats">
        <StatCard label="Customers" value={stats.all} />
        <StatCard label="Have ordered" value={stats.buyers} />
        <StatCard label="Total spent" value={money(stats.spent)} hint="Without cancelled orders" />
        <StatCard label="Blocked" value={stats.blocked} />
      </div>

      <div className="sales-toolbar">
        <div className="sales-tabs" role="tablist" aria-label="Customer filter">
          {tabs.map(([id, label, count]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? 'is-active' : ''}
              onClick={() => setTab(id)}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>

        <input
          className="sales-search"
          type="search"
          placeholder="Search name, email or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search customers"
        />
      </div>

      {error && <p className="sales-empty" role="alert">{error}</p>}

      {loading ? (
        <p className="sales-empty">Loading customers...</p>
      ) : visible.length === 0 ? (
        <p className="sales-empty">
          {customers.length === 0 ? 'No customers yet. New accounts will appear here.' : 'No customers match your search.'}
        </p>
      ) : (
        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Spent</th>
                <th>Last order</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((customer) => (
                <tr key={customer.key}>
                  <td data-label="Customer">
                    <span className="sales-person">
                      <span className="sales-avatar" aria-hidden="true">
                        {customer.photo ? <img src={customer.photo} alt="" /> : initials(customer.name)}
                      </span>
                      <span>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                      </span>
                    </span>
                  </td>
                  <td data-label="Phone">{customer.phone || '-'}</td>
                  <td data-label="Orders">{customer.orderCount}</td>
                  <td data-label="Spent"><strong>{money(customer.spent)}</strong></td>
                  <td data-label="Last order">{formatDate(customer.lastOrderAt)}</td>
                  <td data-label="Status">
                    <span className={`sales-badge ${customer.blocked ? 'sales-badge--cancelled' : 'sales-badge--paid'}`}>
                      {customer.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="sales-btn" onClick={() => setOpenKey(customer.key)}>
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
        <Modal title={open.name} subtitle={open.email} onClose={closeModal}>
          <div className="sales-info">
            <div>
              <span>Phone</span>
              <strong>{open.phone || '-'}</strong>
            </div>
            <div>
              <span>Address</span>
              <strong>{open.address || '-'}</strong>
            </div>
            <div>
              <span>Orders</span>
              <strong>{open.orderCount}</strong>
            </div>
            <div>
              <span>Total spent</span>
              <strong>{money(open.spent)}</strong>
            </div>
          </div>

          <h3 className="sales-subtitle">Order history</h3>
          {open.orders.length === 0 ? (
            <p className="sales-empty sales-empty--small">This customer has not ordered yet.</p>
          ) : (
            <ul className="sales-history">
              {open.orders.map((order) => (
                <li key={order.key}>
                  <span>
                    <strong>{order.number}</strong>
                    <small>{formatDate(order.createdAt)}</small>
                  </span>
                  <StatusBadge status={order.status} />
                  <strong>{money(order.total)}</strong>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className={`sales-btn sales-btn--wide ${open.blocked ? '' : 'sales-btn--danger'}`}
            onClick={() => toggleBlocked(open.email)}
          >
            {open.blocked ? 'Unblock this customer' : 'Block this customer'}
          </button>
        </Modal>
      )}
    </section>
  );
}