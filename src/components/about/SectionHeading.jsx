/**
 * Props
 * - title:     main heading text
 * - subtitle:  optional line under the heading
 * - tone:      'primary' (purple title) | 'dark' (default text colour)
 * - uppercase: renders the title in capitals (used for "Our impact")
 * - as:        heading element, defaults to 'h2'
 */
export default function SectionHeading({
  title,
  subtitle,
  tone = 'primary',
  uppercase = false,
  as: Tag = 'h2',
  id,
}) {
  const classes = [
    'section-title',
    'about-heading__title',
    `about-heading__title--${tone}`,
    uppercase ? 'about-heading__title--upper' : '',
  ].join(' ');

  return (
    <header className="about-heading">
      <Tag id={id} className={classes}>{title}</Tag>
      {subtitle && <p className="about-heading__subtitle">{subtitle}</p>}
    </header>
  );
}