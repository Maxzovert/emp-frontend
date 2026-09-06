import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover disabled:bg-primary-disabled disabled:text-white/70 disabled:opacity-100",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-elevated disabled:opacity-60",
  ghost:
    "bg-transparent text-muted hover:bg-surface hover:text-foreground disabled:opacity-60",
  destructive:
    "bg-error/15 text-error hover:bg-error/25 disabled:opacity-60",
};

const sizes = {
  sm: "h-9 px-3.5 text-xs rounded-md",
  md: "h-10 px-5 text-sm rounded-md",
  lg: "h-11 px-6 text-sm rounded-md",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  href,
  ...props
}) {
  const classes = cn(
    baseClass,
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className,
  );

  const content = (
    <>
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </>
  );

  if (href) {
    const { onClick, ...rest } = props;
    return (
      <Link
        to={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        tabIndex={disabled || loading ? -1 : undefined}
        onClick={(event) => {
          if (disabled || loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </button>
  );
}
