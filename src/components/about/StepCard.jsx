/**
 * Props: number (1-based), title, text
 */
export default function StepCard({ number, title, text }) {
  return (
    <article className="card feature-card step-card">
      <span className="step-card__number" aria-hidden="true">
        {String(number).padStart(2, '0')}
      </span>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__text">{text}</p>
    </article>
  );
}