import { useEffect, useState } from 'react';
import { Star, X } from 'lucide-react';
import './ProductDetail.css';

// Used when a product in products.js has no "reviewList" of its own
const sampleReviews = [
  { id: 1, name: 'Kakada', rating: 5, text: 'Nice texture and scent. Good value.' },
  { id: 2, name: 'Panha', rating: 5, text: 'Absorbs fast and leaves my skin glowing. Love it!' },
];

const defaultDescription =
  'A weightless, buildable tint with a soft-matte velvet finish and 8-hour comfort.';

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

function ProductDetail({ product, onClose, onAddToCart }) {
  const { name, price, rating, bg, image, description } = product;

  const [reviews, setReviews] = useState(product.reviewList ?? sampleReviews);
  const [newRating, setNewRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

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

    setReviews([
      ...reviews,
      { id: Date.now(), name: author.trim(), rating: newRating, text: text.trim() },
    ]);
    setAuthor('');
    setText('');
    setNewRating(5);
  };

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
          <img src={image} alt={name} />
        </div>

        {/* Right: information */}
        <div className="detail-info">
          <div className="detail-top">
            <Stars value={Math.round(rating)} size={12} />
            <button className="detail-close" onClick={onClose} aria-label="Close">
              <X size={22} />
            </button>
          </div>

          <p className="detail-desc">{description ?? defaultDescription}</p>
          <p className="detail-price">${price}</p>

          <button className="detail-add" onClick={() => onAddToCart(product)}>
            Add to cart
          </button>

          <h3 className="detail-heading">Customer reviews</h3>
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