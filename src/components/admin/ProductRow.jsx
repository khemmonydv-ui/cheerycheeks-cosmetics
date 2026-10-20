import StockBadge from './StockBadge';

export default function ProductRow({ product, onToggle, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="adm-product-cell">
          <span className="adm-thumb">
            {product.image ? <img src={product.image} alt="" /> : null}
          </span>
          <span className="adm-product-name">{product.name}</span>
        </div>
      </td>
      <td className="adm-muted">{product.category}</td>
      <td>${Number(product.price).toFixed(2)}</td>
      <td><StockBadge stock={product.stock} /></td>
      <td>
        <button
          className="adm-btn-outline"
          onClick={() => onToggle(product.id)}
          title="Click to change visibility"
        >
          {product.visible ? 'Visible' : 'Hidden'}
        </button>
      </td>
      <td>
        <div className="adm-actions">
          <button className="adm-btn-outline" onClick={() => onEdit(product)}>Edit</button>
          <button className="adm-btn-outline is-danger" onClick={() => onDelete(product)}>Delete</button>
        </div>
      </td>
    </tr>
  );
}