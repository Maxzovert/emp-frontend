"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

export function PasswordInput({
  label = "Password",
  id,
  error,
  hint,
  className,
  containerClassName,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const inputId = id || props.name || "password";

  return (
    <label className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
      {label ? (
        <span className="text-sm font-medium text-foreground">{label}</span>
      ) : null}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={cn(
            "h-10 w-full rounded-md border bg-surface py-2 pr-11 pl-3.5 text-sm text-foreground outline-none transition placeholder:text-muted",
            "focus:border-primary focus:ring-1 focus:ring-primary",
            error ? "border-error" : "border-border",
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute top-1/2 right-2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
      {error ? <span className="text-xs text-error">{error}</span> : null}
      {!error && hint ? (
        <span className="text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
