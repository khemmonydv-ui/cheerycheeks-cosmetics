import Rating from './Rating';

function ProductCard({ product, onAddToCart }) {
  const { name, category, price, rating, reviews, stock, badge, bg, image } = product;

  return (
    <article className="card">
      <div className="card-image" style={{ background: bg }}>
        {badge && <span className="badge">{badge}</span>}
        <img src={image} alt={name} />
      </div>

      <div className="card-body">
        <p className="card-category">{category}</p>
        <h3 className="card-name">{name}</h3>
        <Rating value={rating} count={reviews} />

        <p className="card-price">
          ${price}
          {stock && <span className="card-stock">{stock} Stock</span>}
        </p>

        <button className="btn-cart" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;