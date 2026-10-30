// Orders placed in the shop are saved in localStorage under "orders".
// The shape follows invoices.json (items, subtotal, discount, tax, total, payments),
// so it can be sent to a real backend later without changing the pages.
const KEY = 'orders';

export function getOrders() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Returns true when the order was saved, false when the browser refused to store it
export function saveOrder(order) {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...getOrders()]));
    return true;
  } catch {
    return false;
  }
}

// Only the orders of one customer (customerId = the id of the logged-in account)
export function getOrdersFor(customerId) {
  return getOrders().filter((o) => o.customerId === customerId);
}