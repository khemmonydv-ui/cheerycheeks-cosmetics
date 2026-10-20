import { Star } from 'lucide-react';

// Shows 5 stars + "4.5 (2)"
function Rating({ value, count }) {
  return (
    <div className="rating" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={10} fill="currentColor" strokeWidth={0} />
      ))}
      <span className="rating-text">
        {value} ({count})
      </span>
    </div>
  );
}

export default Rating;