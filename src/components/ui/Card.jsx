import { cn } from "@/utils/cn";

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
  as: Comp = "div",
  ...props
}) {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6 md:p-8",
    lg: "p-8",
  };

  return (
    <Comp
      className={cn(
        "rounded-lg border border-border bg-surface",
        paddings[padding] || paddings.md,
        hover && "transition hover:border-border-strong",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-foreground",
        className,
      )}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }) {
  return (
    <p className={cn("mt-1 text-sm text-muted", className)}>{children}</p>
  );
}
