import ProductRow from './ProductRow';

export default function ProductTable({ products, onToggle, onEdit, onDelete }) {
  const visibleCount = products.filter((p) => p.visible).length;
  const hiddenCount = products.length - visibleCount;

  return (
    <div className="adm-table-card">
      <div className="adm-table-scroll">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="adm-empty">
                  No products match your search. Try a different word or category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="adm-table-footer">
        <span>Showing {products.length} products</span>
        <span>{visibleCount} visible on site · {hiddenCount} hidden</span>
      </footer>
    </div>
  );
}