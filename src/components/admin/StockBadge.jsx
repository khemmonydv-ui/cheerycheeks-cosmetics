export const LOW_STOCK_LIMIT = 10;

export function stockState(stock) {
  if (stock <= 0) return 'out';
  if (stock <= LOW_STOCK_LIMIT) return 'low';
  return 'ok';
}

export default function StockBadge({ stock }) {
  const state = stockState(stock);
  const text = state === 'out' ? 'Out' : state === 'low' ? `${stock} left` : stock;
  return <span className={`adm-badge is-${state}`}>{text}</span>;
}