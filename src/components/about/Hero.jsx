import Button from './Button';

/**
 * Full-width hero with a background image and text on the left.
 * Props: eyebrow, title, text, image, imageAlt, cta: { label, href }
 */
export default function Hero({ eyebrow, title, text, image, imageAlt = '', cta }) {
  return (
    <section className="about-hero">
      <img className="about-hero__bg" src={image} alt={imageAlt} />
      <div className="container about-hero__inner">
        <div className="about-hero__content">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="about-hero__title">{title}</h1>
          <p className="about-hero__text">{text}</p>
          {cta && (
            <div className="about-hero__actions">
              <Button href={cta.href} variant="primary">{cta.label}</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}