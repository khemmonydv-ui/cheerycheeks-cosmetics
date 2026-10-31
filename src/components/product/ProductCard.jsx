import { Star, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import "./ProductCard.css";

// Displays a product price without unnecessary .00 (e.g. $42 or $18.50).
const formatPrice = (value) =>
  `$${Number(value).toFixed(2).replace(/\.00$/, "")}`;

/* Picture with a fallback icon if the file is missing or the path is wrong */
function ProductImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return src && !failed ? (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <Sparkles size={52} strokeWidth={1.2} aria-hidden="true" />
  );
}

export default function ProductCard({
  product,
  inCart = 0,
  onAddToCart,
  onSelect,
}) {
  const { id, name, category, price, oldPrice, rating, reviewCount, tag, image } = product;

  const stock = product.stock ?? product.stockQuantity;
  const ratingValue = Math.min(5, Math.max(0, Number(rating) || 0));
  const totalReviews = Number(reviewCount) || 0;
  const soldOut = stock != null && Number(stock) <= 0;
  const atCartLimit = !soldOut && stock != null && inCart >= Number(stock);
  const cannotAdd = soldOut || atCartLimit;

  const handleViewDetail = () => onSelect?.(id);
  const handleAddToCart = () => onAddToCart?.(product);

  return (
    <article className="card product-card product-card--shop">
      {/* Opens the product-details popup, except over the cart button. */}
      <button
        type="button"
        className="product-card__open"
        onClick={handleViewDetail}
        aria-label={`View details for ${name}`}
      />

      <div className="product-card__media">
        {tag && <span className="product-card__tag">{tag}</span>}
        <ProductImage src={image} alt={name} />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category || "Beauty"}</p>
        <h3 className="product-card__name">{name}</h3>

        <div
          className="product-card__rating"
          aria-label={
            totalReviews
              ? `${ratingValue.toFixed(1)} out of 5, ${totalReviews} reviews`
              : "No reviews yet"
          }
        >
          <span className="product-card__stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={13}
                strokeWidth={1.4}
                fill={index < Math.round(ratingValue) ? "currentColor" : "none"}
                className={index < Math.round(ratingValue) ? "is-filled" : "is-empty"}
              />
            ))}
          </span>
          <span className="product-card__review-count">
            {totalReviews ? `${ratingValue.toFixed(1)} (${totalReviews})` : "No reviews"}
          </span>
        </div>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>{formatPrice(price)}</strong>
            {oldPrice != null && Number(oldPrice) > Number(price) && (
              <s>{formatPrice(oldPrice)}</s>
            )}
          </p>

          <button
            type="button"
            className="product-card__add"
            onClick={handleAddToCart}
            disabled={cannotAdd}
            aria-label={`${
              soldOut ? "Sold out" : atCartLimit ? "Maximum quantity in cart" : "Add to cart"
            }: ${name}`}
          >
            {soldOut ? "SOLD OUT" : atCartLimit ? "ALL IN YOUR CART" : "ADD TO CART"}
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
            {inCart > 0 && <span className="product-card__count">{inCart}</span>}
          </button>
        </div>
      </div>
    </article>
  );
}