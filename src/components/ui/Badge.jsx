import { cn } from "@/utils/cn";

const tones = {
  default: "bg-surface text-foreground border-border",
  primary: "bg-primary text-white border-transparent",
  success: "bg-success/15 text-success border-transparent",
  warning: "bg-warning/20 text-warning border-transparent",
  error: "bg-error/15 text-error border-transparent",
  outline: "bg-transparent text-muted border-border",
};

export function Badge({
  children,
  className,
  tone = "default",
  dot = false,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium",
        tones[tone] || tones.default,
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-success",
            tone === "primary" && "bg-white",
            tone === "error" && "bg-error",
            tone === "warning" && "bg-warning",
            (tone === "default" || tone === "outline") && "bg-muted",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
