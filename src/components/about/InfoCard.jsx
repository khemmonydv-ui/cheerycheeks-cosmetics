/**
 * Mission / vision card.
 * Props: title, text
 */
export default function InfoCard({ title, text }) {
  return (
    <article className="info-card">
      <h2 className="info-card__title">{title}</h2>
      <p className="info-card__text">{text}</p>
    </article>
  );
}