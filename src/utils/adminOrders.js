// Orders for the ADMIN pages. It does not replace utils/orders.js (the one Cart and
// Account use). It only READS the orders that Cart saves in localStorage, plus the old
// orders in invoices.json, and lets the admin change an order's status.

export const ORDERS_CHANGED = 'cherrycheeks-orders-changed';
const STATUS_KEY = 'cherrycheeks-invoice-status'; // status changes on invoices.json orders

export const STATUSES = ['pending', 'paid', 'shipped', 'cancelled'];
export const STATUS_LABEL = {
  pending: 'Pending',
  paid: 'Paid',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
};

const readKey = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const isOrder = (o) => o && typeof o === 'object' && o.orderNumber && Array.isArray(o.items);

// the orders in one saved value: either [order, ...] or { someKey: [order, ...] }
function ordersIn(value) {
  if (Array.isArray(value)) return value.filter(isOrder);
  if (value && typeof value === 'object') {
    return Object.values(value).filter(Array.isArray).flat().filter(isOrder);
  }
  return [];
}

function mapOrders(value, fn) {
  if (Array.isArray(value)) return value.map((o) => (isOrder(o) ? fn(o) : o));
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, Array.isArray(v) ? v.map((o) => (isOrder(o) ? fn(o) : o)) : v])
  );
}

// Find where Cart saved the orders: look through localStorage for saved orders
function findStores() {
  const stores = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key === STATUS_KEY) continue;
    const value = readKey(key, null);
    if (ordersIn(value).length > 0) stores.push({ key, value });
  }
  return stores;
}

function cleanStatus(value, fallback = 'paid') {
  const text = String(value || '').toLowerCase();
  if (STATUSES.includes(text)) return text;
  if (['completed', 'complete', 'done', 'delivered'].includes(text)) return 'paid';
  if (['canceled', 'void', 'refunded'].includes(text)) return 'cancelled';
  return fallback;
}

async function readJson(file) {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}products-data/${file}`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

const findAccount = (accounts, id, email) =>
  accounts.find(
    (a) =>
      (id != null && Number(a.id) === Number(id)) ||
      (email && String(a.email || '').toLowerCase() === String(email).toLowerCase())
  );

// ----- an order saved by Cart.jsx -> the shape the admin pages use -----
function fromCart(order, accounts) {
  const account = findAccount(accounts, order.customerId, order.customerEmail);
  const items = order.items.map((line) => ({
    productId: line.productId,
    name: line.name,
    price: Number(line.unitPrice ?? line.price) || 0,
    qty: Number(line.quantity ?? line.qty) || 1,
    image: line.image || null,
  }));

  return {
    key: `web-${order.id ?? order.orderNumber}`,
    rawId: order.id,
    number: order.orderNumber,
    createdAt: order.createdAt || '',
    customerEmail: order.customerEmail || account?.email || '',
    customerName: account?.fullName || order.customerName || order.customerEmail || 'Customer',
    customerPhone: account?.phone || '',
    address: account?.address || '',
    items,
    total: Number(order.total) || items.reduce((sum, l) => sum + l.price * l.qty, 0),
    status: cleanStatus(order.status),
    source: 'website',
  };
}

// ----- an old order in invoices.json -----
function fromInvoice(invoice, products, accounts, statusChanges) {
  const account = findAccount(accounts, invoice.customerId ?? invoice.customer?.id, invoice.customerEmail);
  const rawItems = invoice.items || invoice.lines || [];

  const items = rawItems.map((item) => {
    const productId = item.productId ?? item.id;
    const product = products.find((p) => Number(p.id) === Number(productId));
    return {
      productId,
      name: item.name || product?.name || `Product #${productId}`,
      price: Number(item.unitPrice ?? item.price ?? product?.price ?? 0),
      qty: Number(item.quantity ?? item.qty ?? 1),
      image: item.image || product?.image || null,
    };
  });

  const key = `inv-${invoice.id}`;
  return {
    key,
    number: invoice.invoiceNumber || invoice.orderNumber || `#${invoice.id}`,
    createdAt: invoice.createdAt || '',
    customerEmail: account?.email || invoice.customerEmail || '',
    customerName: account?.fullName || invoice.customerName || 'Walk-in customer',
    customerPhone: account?.phone || '',
    address: account?.address || '',
    items,
    total:
      Number(invoice.total ?? invoice.totalAmount ?? invoice.grandTotal) ||
      items.reduce((sum, l) => sum + l.price * l.qty, 0),
    status: cleanStatus(statusChanges[key] ?? invoice.status),
    source: 'invoice',
  };
}

/** Every order, newest first. */
export async function loadAllOrders() {
  const [invoices, products, jsonAccounts] = await Promise.all([
    readJson('invoices.json'),
    readJson('products.json'),
    readJson('accounts.json'),
  ]);

  const signedUp = readKey('accounts', []);
  const accounts = [...jsonAccounts, ...(Array.isArray(signedUp) ? signedUp : [])];

  // orders from Cart (the same order is never counted twice)
  const seen = new Set();
  const website = findStores()
    .flatMap((store) => ordersIn(store.value))
    .filter((order) => {
      const id = `${order.id}-${order.orderNumber}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((order) => fromCart(order, accounts));

  const statusChanges = readKey(STATUS_KEY, {});
  const old = invoices.map((invoice) => fromInvoice(invoice, products, accounts, statusChanges));

  return [...website, ...old].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

/** Admin changes the status of an order. */
export function setOrderStatus(order, status) {
  try {
    if (order.source === 'website') {
      // write it back where Cart saved it, in the same upper-case style (PAID, SHIPPED...)
      findStores().forEach((store) => {
        const next = mapOrders(store.value, (o) =>
          String(o.id) === String(order.rawId) && o.orderNumber === order.number
            ? { ...o, status: status.toUpperCase() }
            : o
        );
        localStorage.setItem(store.key, JSON.stringify(next));
      });
    } else {
      localStorage.setItem(STATUS_KEY, JSON.stringify({ ...readKey(STATUS_KEY, {}), [order.key]: status }));
    }
    window.dispatchEvent(new Event(ORDERS_CHANGED)); // open admin pages refresh
  } catch {
    // storage full or blocked
  }
}