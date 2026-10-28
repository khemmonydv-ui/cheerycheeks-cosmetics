import { useProducts } from '../../context/ProductsContext';
import { latestMessages } from '../../data/messages';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';
import RestockCard from '../../components/admin/dashboard/RestockCard';
import MessagesCard from '../../components/admin/dashboard/MessagesCard';
import CategoryStockCard from '../../components/admin/dashboard/CategoryStockCard';
import { stockState } from '../../utils/stock';
import { BoxIcon, DollarIcon } from '../../components/admin/Icons';

const formatMoney = (n) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AdminDashboard() {
  const { products } = useProducts();

  // ----- Stat cards -----
  const onSite = products.filter((p) => p.visible).length;
  const needRestock = products.filter((p) => stockState(p.stock) !== 'ok');
  const stockValue = products.reduce(
    (sum, p) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );

  // ----- Needs restocking: emptiest first, show 4 -----
  const restockList = [...needRestock].sort((a, b) => a.stock - b.stock).slice(0, 4);

  // ----- Stock by category: add up the stock of each category, biggest first -----
  const totals = {};
  products.forEach((p) => {
    totals[p.category] = (totals[p.category] || 0) + (Number(p.stock) || 0);
  });
  const categories = Object.entries(totals)
    .map(([name, stock]) => ({ name, stock }))
    .sort((a, b) => b.stock - a.stock);

  return (
    <>
      <AdminHeader title="Dashboard" subtitle="A quick look at your shop today." />

      <section className="adm-stats">
        <StatCard value={products.length} label="Products" icon={<BoxIcon />} />
        <StatCard value={onSite} label="Visible on site" icon={<BoxIcon />} />
        <StatCard value={needRestock.length} label="Need restocking" icon={<BoxIcon />} />
        <StatCard value={formatMoney(stockValue)} label="Stock value" icon={<DollarIcon />} />
      </section>

      <div className="dash-grid">
        <RestockCard products={restockList} />
        <MessagesCard messages={latestMessages} />
      </div>

      <CategoryStockCard categories={categories} />
    </>
  );
}