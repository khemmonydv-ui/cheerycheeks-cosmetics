import { useState } from 'react';
import { useProducts } from '../../context/ProductsContext';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';
import ProductToolbar from '../../components/admin/ProductToolbar';
import ProductTable from '../../components/admin/ProductTable';
import ProductFormModal from '../../components/admin/ProductFormModal';
import { stockState } from '../../components/admin/StockBadge';
import { BoxIcon, EyeIcon, AlertIcon, BoxOffIcon } from '../../components/admin/Icons';

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleVisible } = useProducts();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [modal, setModal] = useState(null); // null = closed, 'new' = add, {product} = edit

  // Stat cards use ALL products (not the filtered list)
  const total = products.length;
  const onSite = products.filter((p) => p.visible).length;
  const low = products.filter((p) => stockState(p.stock) === 'low').length;
  const out = products.filter((p) => stockState(p.stock) === 'out').length;

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchCategory = category === 'All' || p.category === category;
    const matchQuery = `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleSave = (data) => {
    if (modal === 'new') addProduct(data);
    else updateProduct(modal.id, data);
    setModal(null);
  };

  const handleDelete = (p) => {
    if (window.confirm(`Delete "${p.name}"?`)) deleteProduct(p.id);
  };

  return (
    <>
      <AdminHeader
        title="Products"
        subtitle="Add, edit and hide the items shown on your Products page."
      />

      <section className="adm-stats">
        <StatCard value={total} label="Products" icon={<BoxIcon />} />
        <StatCard value={onSite} label="Visible on site" icon={<EyeIcon />} />
        <StatCard value={low} label="Low stock" icon={<AlertIcon />} tone="warn" />
        <StatCard value={out} label="Out of stock" icon={<BoxOffIcon />} tone="warn" />
      </section>

      <ProductToolbar
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        onAdd={() => setModal('new')}
      />

      <ProductTable
        products={filtered}
        onToggle={toggleVisible}
        onEdit={(p) => setModal(p)}
        onDelete={handleDelete}
      />

      {modal && (
        <ProductFormModal
          key={modal === 'new' ? 'new' : modal.id}
          product={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}