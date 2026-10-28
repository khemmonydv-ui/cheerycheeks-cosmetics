/**
 * Props
 * - href:     link target
 * - variant:  'primary' | 'secondary' | 'outline'
 * - size:     'sm' | 'md' | 'lg'
 * - children: label
 */
export default function Button({ href, variant = 'primary', size = 'sm', children }) {
  const sizeClass = size === 'md' ? '' : ` btn-${size}`;
  return (
    <a href={href} className={`btn btn-${variant}${sizeClass}`}>
      {children}
    </a>
  );
}