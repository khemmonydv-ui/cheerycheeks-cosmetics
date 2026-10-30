/**
 * Category / product tile with a centred label.
 * Props: name, image, href
 */
export default function ProductCard({ name, image, href }) {
  return (
    <a href={href} className="product-card">
      <div className="product-card__image">
        <img src={image} alt="" loading="lazy" />
      </div>
      <h3 className="product-card__name">{name}</h3>
    </a>
  );
}