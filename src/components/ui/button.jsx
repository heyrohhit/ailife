import Link from "next/link";

const variants = {
  primary:
    "bg-brand text-white hover:bg-brand-700 shadow-sm shadow-brand-900/10",
  secondary:
    "bg-surface text-ink border border-line hover:border-brand-300 hover:text-brand-700",
  ghost: "text-ink hover:text-brand-700",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * Button that renders as a Next.js <Link> when `href` is provided, otherwise a
 * <button>. Keeps CTA styling consistent across the site.
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
