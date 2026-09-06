"use client";

import { cn } from "@/utils/cn";

export function Toggle({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  id,
  className,
}) {
  const toggleId = id || "toggle";

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {(label || description) && (
        <div className="min-w-0">
          {label ? (
            <label
              htmlFor={toggleId}
              className="block text-sm font-medium text-foreground"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          ) : null}
        </div>
      )}

      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative h-8 w-14 shrink-0 rounded-full p-0.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-primary" : "bg-border",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-white shadow transition",
            checked && "translate-x-6",
          )}
        />
      </button>
    </div>
  );
}
