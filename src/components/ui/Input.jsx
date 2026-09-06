import { cn } from "@/utils/cn";

export function Input({
  label,
  id,
  error,
  hint,
  className,
  containerClassName,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <label className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "h-10 w-full rounded-md border bg-surface px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          error ? "border-error" : "border-border",
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {error ? <span className="text-xs text-error">{error}</span> : null}
      {!error && hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
