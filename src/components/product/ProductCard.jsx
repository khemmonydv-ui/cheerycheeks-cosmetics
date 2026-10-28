import { Star, ShoppingBag, Sparkles } from "lucide-react";
import "./ProductCard.css";

export default function ProductCard({
  product,
  onAddToCart,
  onSelect,
}) {
  const {
    id,
    name,
    category,
    price,
    oldPrice,
    rating,
    tag,
    image,
  } = product;

  // Open product detail
  const handleViewDetail = () => {
    onSelect?.(id);
  };

  // Add product to cart
  const handleAddToCart = () => {
    onAddToCart?.(product);
  };

  return (
    <article className="card product-card">

      {/* Makes the whole card clickable */}
      <button
        type="button"
        className="product-card__open"
        onClick={handleViewDetail}
        aria-label={`View details for ${name}`}
      />

      {/* Product Image */}
      <div className="product-card__media">
        {tag && (
          <span className="product-card__tag">
            {tag}
          </span>
        )}

        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
          />
        ) : (
          <Sparkles
            size={48}
            strokeWidth={1.25}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Product Information */}
      <div className="product-card__body">
        <p className="product-card__category">
          {category}
        </p>

        <h3 className="product-card__name">
          {name}
        </h3>

        {/* Rating */}
        <p
          className="product-card__rating"
          aria-label={`Rated ${rating ?? 0} out of 5`}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={15}
              strokeWidth={1.5}
              fill={
                i < Math.round(rating ?? 0)
                  ? "currentColor"
                  : "none"
              }
              aria-hidden="true"
            />
          ))}
        </p>

        {/* Product Footer */}
        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>
              ${Number(price).toFixed(2)}
            </strong>

            {oldPrice != null && (
              <s>
                ${Number(oldPrice).toFixed(2)}
              </s>
            )}
          </p>

          {/* Add to Cart */}
          <button
            type="button"
            className="product-card__add"
            aria-label={`Add ${name} to cart`}
            onClick={handleAddToCart}
          >
            <ShoppingBag
              size={20}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}