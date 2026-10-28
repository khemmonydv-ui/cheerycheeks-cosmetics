import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import { money } from '../cart/money';
import { stockState } from '../../utils/stock';
import './ProductDetail.css';

// Row of 5 stars. "value" = how many are filled.
function Stars({ value, size = 8 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={0}
          fill="currentColor"
          className={n <= value ? 'star on' : 'star off'}
        />
      ))}
    </span>
  );
}

function stockText(stock) {
  const state = stockState(stock);
  if (state === 'out') return 'Sold out';
  if (state === 'low') return `Only ${stock} left`;
  return `${stock} in stock`;
}

// product = the live product from ProductsContext, so new reviews, price and
// stock changes show up here straight away.
function ProductDetail({ product, inCart = 0, onClose, onAddToCart, onAddReview }) {
  const { id, name, brand, sku, category, price, stock, sold, rating, reviewCount, reviews, bg, image, description } = product;

  const [newRating, setNewRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const state = stockState(stock);
  const allInCart = state !== 'out' && inCart >= stock;

  // Close with the Escape key, and stop the page behind from scrolling
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    // Saved in ProductsContext, so the review stays after the panel is closed
    onAddReview(id, { name: author.trim(), rating: newRating, text: text.trim() });
    setAuthor('');
    setText('');
    setNewRating(5);
  };

  let addText = 'Add to cart';
  if (state === 'out') addText = 'Sold out';
  else if (allInCart) addText = 'All in your cart';

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="detail"
        role="dialog"
        aria-modal="true"
        aria-label={name}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: product picture */}
        <div className="detail-media" style={{ background: bg }}>
          {image && <img src={image} alt={name} />}
        </div>

        {/* Right: information */}
        <div className="detail-info">
          <div className="detail-top">
            <p className="detail-category">{category}</p>
            <button className="detail-close" onClick={onClose} aria-label="Close">
              <X size={22} />
            </button>
          </div>

          <h2 className="detail-name">{name}</h2>
          <p className="detail-meta">
            {[brand, sku && `SKU ${sku}`].filter(Boolean).join(' · ')}
          </p>

          <p className="detail-rating">
            <Stars value={Math.round(rating)} size={12} />
            <span>
              {reviewCount > 0
                ? `${rating} · ${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
                : 'No reviews yet'}
            </span>
          </p>

          <p className="detail-desc">{description}</p>
          <p className="detail-price">{money(price)}</p>

          <p className={`detail-stock is-${state}`}>
            {stockText(stock)}
            {sold > 0 && <span className="detail-sold"> · {sold} sold</span>}
          </p>

          <button
            className="detail-add"
            disabled={state === 'out' || allInCart}
            onClick={() => onAddToCart(product)}
          >
            {addText}
          </button>

          <h3 className="detail-heading">Customer reviews</h3>
          {reviews.length === 0 ? (
            <p className="review-empty">Be the first to review this product.</p>
          ) : (
            <ul className="review-list">
              {reviews.map((r) => (
                <li key={r.id} className="review">
                  <p className="review-head">
                    <strong>{r.name}</strong>
                    <Stars value={r.rating} size={11} />
                  </p>
                  <p className="review-text">{r.text}</p>
                </li>
              ))}
            </ul>
          )}

          <form className="review-form" onSubmit={handleSubmit}>
            <p className="review-label">Write a review</p>

            <div className="star-picker">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setNewRating(n)}
                  aria-label={`${n} stars`}
                  aria-pressed={n === newRating}
                >
                  <Star
                    size={24}
                    strokeWidth={0}
                    fill="currentColor"
                    className={n <= newRating ? 'star on' : 'star off'}
                  />
                </button>
              ))}
            </div>

            <input
              className="field"
              type="text"
              placeholder="Your name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <textarea
              className="field field-area"
              placeholder="Share your experience..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <button type="submit" className="detail-submit">
              Submit review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;