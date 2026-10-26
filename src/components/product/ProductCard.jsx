import Rating from './Rating';
import { money } from '../cart/money';
import { stockState } from '../../utils/stock';

// What to write next to the price, based on how much is left
function stockText(stock) {
  const state = stockState(stock);
  if (state === 'out') return 'Sold out';
  if (state === 'low') return `Only ${stock} left`;
  return `${stock} in stock`;
}

// inCart = how many of this product are already in the cart
function ProductCard({ product, inCart = 0, onAddToCart, onSelect }) {
  const { name, brand, category, price, rating, reviewCount, stock, badge, bg, image } = product;

  const state = stockState(stock);
  const allInCart = state !== 'out' && inCart >= stock;

  let buttonText = 'Add to cart';
  if (state === 'out') buttonText = 'Sold out';
  else if (allInCart) buttonText = 'All in your cart';

  return (
    // Clicking anywhere on the card opens the detail panel
    <article className={state === 'out' ? 'card is-out' : 'card'} onClick={() => onSelect(product.id)}>
      <div className="card-image" style={{ background: bg }}>
        {badge && <span className={`badge badge-${state}`}>{badge}</span>}
        {image && <img src={image} alt={name} loading="lazy" />}
      </div>

      <div className="card-body">
        <p className="card-category">
          {category}
          {brand && <span className="card-brand"> · {brand}</span>}
        </p>
        <h3 className="card-name">
          {/* a real button so keyboard users can open it with Enter */}
          <button className="card-name-btn">{name}</button>
        </h3>
        <Rating value={rating} count={reviewCount} />

        <p className="card-price">
          {money(price)}
          <span className={`card-stock is-${state}`}>{stockText(stock)}</span>
        </p>

        <button
          className="btn-cart"
          disabled={state === 'out' || allInCart}
          onClick={(e) => {
            e.stopPropagation(); // don't open the panel when adding to cart
            onAddToCart(product);
          }}
        >
          {buttonText}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;