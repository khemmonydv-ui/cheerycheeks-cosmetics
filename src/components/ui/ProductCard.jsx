import { TubeLotion } from "lucide-react";
import "./ProductCard.css";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
    <path
      d="M5 12h14m-6-6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProductCard({
  title = "Skincare",
  description = "Strength & shine",
  image,
  imageAlt = "",
  href = "#",
  icon = <TubeLotion size={24} strokeWidth={1.6} aria-hidden="true" />,
}) {
  return (
    <article className="product-card">
      <div className="product-card__content">
        <span className="product-card__icon">{icon}</span>

        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__text">{description}</p>

        <a href={href} className="product-card__arrow" aria-label={`Shop ${title}`}>
          <ArrowIcon />
        </a>
      </div>

      {image && (
        <img
          className="product-card__image"
          src={image}
          alt={imageAlt}
          loading="lazy"
        />
      )}
    </article>
  );
}