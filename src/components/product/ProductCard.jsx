import { Star, ShoppingBag, Sparkles } from "lucide-react";
import "./ProductCard.css";

/**
 * One product in a grid.
 * product = { name, category, price, oldPrice?, rating, tag?, image? }
 * Without an image it shows a soft placeholder.
 */
export default function ProductCard({ product, onAddToCart }) {
  const { name, category, price, oldPrice, rating, tag, image } = product;

  return (
    <article className="card product-card">
      <div className="product-card__media">
        {tag && <span className="product-card__tag">{tag}</span>}

        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <Sparkles size={48} strokeWidth={1.25} aria-hidden="true" />
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category}</p>
        <h3 className="product-card__name">{name}</h3>

        <p className="product-card__rating" aria-label={`Rated ${rating} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={15}
              strokeWidth={1.5}
              fill={i < Math.round(rating) ? "currentColor" : "none"}
              aria-hidden="true"
            />
          ))}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>${price.toFixed(2)}</strong>
            {oldPrice && <s>${oldPrice.toFixed(2)}</s>}
          </p>

          <button
            type="button"
            className="product-card__add"
            aria-label={`Add ${name} to cart`}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}