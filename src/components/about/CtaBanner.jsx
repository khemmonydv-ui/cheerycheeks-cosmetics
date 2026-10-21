import Button from './Button';

/**
 * Props: title, text, button: { label, href }
 */
export default function CtaBanner({ title, text, button }) {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <h2 className="cta-banner__title">{title}</h2>
        <p className="body-text">{text}</p>
        <Button href={button.href} variant="primary">{button.label}</Button>
      </div>
    </section>
  );
}