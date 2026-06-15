import { Link } from 'react-router-dom';

/**
 * Button — reusable CTA component for MINTA.
 * Renders <Link> when `to` is provided, <a> when `href` is provided, <button> otherwise.
 *
 * @param {'primary' | 'outline' | 'ghost'} variant - Visual style
 * @param {string} href - If provided, renders as anchor tag
 * @param {string} to - If provided, renders as React Router Link
 * @param {string} className - Additional class overrides
 * @param {React.ReactNode} children - Button label content
 */
export default function Button({ variant = 'primary', href, to, className = '', children, ...props }) {
  const base = 'font-syne font-bold text-xs tracking-widest rounded-full transition-all duration-300 inline-block text-center cursor-pointer';

  const variants = {
    primary: 'bg-sage text-canvas px-8 py-4 hover:scale-105 hover:bg-white hover:text-canvas shadow-2xl',
    outline: 'border border-glass text-text-primary px-8 py-3.5 hover:bg-text-primary hover:text-canvas',
    ghost: 'text-text-muted hover:text-text-primary px-4 py-2',
  };

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
