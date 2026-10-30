import { useEffect, useState } from "react";
import { Star, ShoppingBag, Sparkles } from "lucide-react";
import "./ProductCard.css";

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