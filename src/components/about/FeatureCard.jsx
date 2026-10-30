/**
 * Small outlined card with a title and short text.
 * Props: title, text
 */
export default function FeatureCard({ title, text }) {
  return (
    <article className="card feature-card">
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__text">{text}</p>
    </article>
  );
}