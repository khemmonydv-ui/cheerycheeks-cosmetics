// Customers: accounts.json (read-only) + accounts created on the Sign up page
// (saved in localStorage under "accounts"). Blocking is saved in localStorage.

const BLOCKED_KEY = 'cherrycheeks-blocked-customers';
export const CUSTOMERS_CHANGED = 'cherrycheeks-customers-changed';

// Accounts with these roles are staff, not customers
const STAFF_ROLES = ['ADMIN', 'CASHIER', 'MANAGER', 'STAFF', 'WAREHOUSE', 'SUPPLIER'];

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export function getBlocked() {
  const list = read(BLOCKED_KEY, []);
  return Array.isArray(list) ? list : [];
}

export const isBlocked = (email) => getBlocked().includes(String(email).toLowerCase());

export function toggleBlocked(email) {
  const key = String(email).toLowerCase();
  const list = getBlocked();
  const next = list.includes(key) ? list.filter((e) => e !== key) : [...list, key];
  try {
    localStorage.setItem(BLOCKED_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CUSTOMERS_CHANGED));
  } catch {
    // storage full or blocked
  }
}

async function readAccountsJson() {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}products-data/accounts.json`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Customers with their orders and totals. Pass in the orders from loadAllOrders(). */
export async function loadCustomers(orders) {
  const fromJson = await readAccountsJson();
  const signedUp = read('accounts', []);
  const blocked = getBlocked();

  const byEmail = new Map();
  [...fromJson, ...(Array.isArray(signedUp) ? signedUp : [])].forEach((account) => {
    const email = String(account.email || '').toLowerCase();
    if (!email) return;
    if (account.role && STAFF_ROLES.includes(String(account.role).toUpperCase())) return;
    byEmail.set(email, { ...byEmail.get(email), ...account });
  });

  return [...byEmail.entries()].map(([email, account]) => {
    const mine = orders.filter((order) => String(order.customerEmail).toLowerCase() === email);
    const paid = mine.filter((order) => order.status !== 'cancelled');

    return {
      key: email,
      id: account.id ?? null,
      name: account.fullName || account.name || email,
      email,
      phone: account.phone || '',
      address: account.address || '',
      photo: account.photo || null,
      joinedAt: account.createdAt || account.joinedAt || '',
      blocked: blocked.includes(email),
      orders: mine,
      orderCount: mine.length,
      spent: paid.reduce((sum, order) => sum + order.total, 0),
      lastOrderAt: mine[0]?.createdAt || '',
    };
  }).sort((a, b) => b.spent - a.spent || a.name.localeCompare(b.name));
}