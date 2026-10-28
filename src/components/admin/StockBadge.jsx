import { stockState } from '../../utils/stock';

export default function StockBadge({ stock }) {
  const state = stockState(stock);
  const text = state === 'out' ? 'Out' : state === 'low' ? `${stock} left` : stock;
  return <span className={`adm-badge is-${state}`}>{text}</span>;
}