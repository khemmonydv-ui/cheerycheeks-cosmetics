import { ArrowRight } from "lucide-react";
import "./ArticleCard.css";

export default function ArticleCard({
  date,
  title,
  image,
  imageAlt = "",
  href = "#",
}) {
  return (
    <article className="article-card">
      {image && (
        <img className="article-card__image" src={image} alt={imageAlt} loading="lazy" />
      )}

      <div className="article-card__content">
        <time className="article-card__date">{date}</time>
        <h3 className="article-card__title">{title}</h3>

        <a href={href} className="article-card__link">
          Read More <ArrowRight size={14} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}