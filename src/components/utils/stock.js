// One place for the stock rules, so the shop and the admin always agree.
export const LOW_STOCK_LIMIT = 10;

export function stockState(stock) {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_LIMIT) return 'low';
  return 'ok';
}