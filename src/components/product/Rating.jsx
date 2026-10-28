import { Star } from 'lucide-react';

// Shows 5 stars (filled up to the rounded rating) + "4.5 (2)",
// or "No reviews yet" when nobody has reviewed the product.
function Rating({ value, count }) {
  const filled = Math.round(value);

  return (
    <div
      className="rating"
      aria-label={count > 0 ? `Rated ${value} out of 5 from ${count} reviews` : 'No reviews yet'}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={10}
          fill="currentColor"
          strokeWidth={0}
          className={n <= filled && count > 0 ? 'rating-star on' : 'rating-star off'}
        />
      ))}
      <span className="rating-text">
        {count > 0 ? `${value} (${count})` : 'No reviews yet'}
      </span>
    </div>
  );
}

export default Rating;