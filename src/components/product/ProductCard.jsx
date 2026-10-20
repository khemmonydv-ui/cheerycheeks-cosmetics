import Rating from './Rating';

function ProductCard({ product, onAddToCart, onSelect }) {
  const { name, category, price, rating, reviews, stock, badge, bg, image } = product;

  return (
    // Clicking anywhere on the card opens the detail panel
    <article className="card" onClick={() => onSelect(product)}>
      <div className="card-image" style={{ background: bg }}>
        {badge && <span className="badge">{badge}</span>}
        <img src={image} alt={name} />
      </div>

      <div className="card-body">
        <p className="card-category">{category}</p>
        <h3 className="card-name">
          {/* a real button so keyboard users can open it with Enter */}
          <button className="card-name-btn">{name}</button>
        </h3>
        <Rating value={rating} count={reviews} />

        <p className="card-price">
          ${price}
          {stock && <span className="card-stock">{stock} Stock</span>}
        </p>

        <button
          className="btn-cart"
          onClick={(e) => {
            e.stopPropagation(); // don't open the panel when adding to cart
            onAddToCart(product);
          }}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;