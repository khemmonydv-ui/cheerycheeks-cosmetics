
import { Star, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import "./ProductCard.css";


// Displays a product price without unnecessary .00 (e.g. $42 or $18.50).
const formatPrice = (value) =>
  `$${Number(value).toFixed(2).replace(/\.00$/, '')}`;

export default function ProductCard({
  product,
  inCart = 0,
  onAddToCart,
  onSelect,
}) {
  const { id, name, category, price, oldPrice, rating, reviewCount, tag, image, stock } = product;

  const ratingValue = Math.min(5, Math.max(0, Number(rating) || 0));
  const totalReviews = Number(reviewCount) || 0;
  const soldOut = stock != null && Number(stock) <= 0;
  const atCartLimit = !soldOut && stock != null && inCart >= Number(stock);
  const cannotAdd = soldOut || atCartLimit;

  const handleViewDetail = () => onSelect?.(id);
  const handleAddToCart = () => onAddToCart?.(product);

  return (
    <article className="card product-card product-card--shop">
      {/* Opens the existing product-details popup, except over the cart button. */}
      <button
        type="button"
        className="product-card__open"
        onClick={handleViewDetail}
        aria-label={`View details for ${name}`}
      />

      <div className="product-card__media">
        {tag && <span className="product-card__tag">{tag}</span>}
        {image ? (
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <Sparkles size={52} strokeWidth={1.2} aria-hidden="true" />
        )}
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{category || 'Beauty'}</p>
        <h3 className="product-card__name">{name}</h3>

        <div
          className="product-card__rating"
          aria-label={totalReviews ? `${ratingValue.toFixed(1)} out of 5, ${totalReviews} reviews` : 'No reviews yet'}
        >
          <span className="product-card__stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={13}
                strokeWidth={1.4}
                fill={index < Math.round(ratingValue) ? 'currentColor' : 'none'}
                className={index < Math.round(ratingValue) ? 'is-filled' : 'is-empty'}
              />
            ))}
          </span>
          <span className="product-card__review-count">
            {totalReviews ? `${ratingValue.toFixed(1)} (${totalReviews})` : 'No reviews'}
          </span>
        </div>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>{formatPrice(price)}</strong>
            {oldPrice != null && Number(oldPrice) > Number(price) && (
              <s>{formatPrice(oldPrice)}</s>
            )}


/* Picture with a fallback icon if the file is missing or the path is wrong */
function ProductImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return src && !failed ? (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
  ) : (
    <Sparkles size={48} strokeWidth={1.25} aria-hidden="true" />
  );
}

/**
 * Same look as the Home page bestseller card.
 * Props (the same ones Products.jsx already passes):
 *   product, inCart, onAddToCart(product), onSelect(productId)
 */
export default function ProductCard({ product, inCart = 0, onAddToCart, onSelect }) {
  const { id, name, category, price, oldPrice, rating, tag, image } = product;

  const currentPrice = Number(price) || 0;
  const previousPrice = Number(oldPrice) || 0;
  const productRating = Number(rating) || 0;

  const stock = product.stockQuantity ?? product.stock;
  const outOfStock = stock !== undefined && stock !== null && Number(stock) <= 0;

  return (
    <article className="card product-card">
      <button
        type="button"
        className="product-card__media"
        aria-label={`View ${name}`}
        onClick={() => onSelect?.(id)}
      >
        {tag && <span className="product-card__tag">{tag}</span>}
        {outOfStock && <span className="product-card__tag product-card__tag--out">Sold out</span>}
        <ProductImage src={image} alt={name} />
      </button>

      <div className="product-card__body">
        <p className="product-card__category">{category || "Beauty"}</p>

        <h3 className="product-card__name">
          <button type="button" onClick={() => onSelect?.(id)}>
            {name}
          </button>
        </h3>

        <p className="product-card__rating" aria-label={`Rated ${productRating} out of 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              size={15}
              strokeWidth={1.5}
              fill={i < Math.round(productRating) ? "currentColor" : "none"}
              aria-hidden="true"
            />
          ))}
        </p>

        <div className="product-card__footer">
          <p className="product-card__price">
            <strong>${currentPrice.toFixed(2)}</strong>
            {previousPrice > 0 && <s>${previousPrice.toFixed(2)}</s>}
          </p>

          <button
            type="button"
            className="product-card__add"
            onClick={handleAddToCart}
            disabled={cannotAdd}
            aria-label={`${soldOut ? 'Sold out' : atCartLimit ? 'Maximum quantity in cart' : 'Add to cart'}: ${name}`}
          >
            {soldOut ? 'SOLD OUT' : atCartLimit ? 'ALL IN YOUR CART' : 'ADD TO CART'}
            aria-label={`Add ${name} to cart`}
            disabled={outOfStock}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingBag size={20} strokeWidth={1.75} aria-hidden="true" />
            {inCart > 0 && <span className="product-card__count">{inCart}</span>}
          </button>
        </div>
      </div>
    </article>
  );
}