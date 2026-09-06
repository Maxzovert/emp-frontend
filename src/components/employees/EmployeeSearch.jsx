"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function EmployeeSearch({ value, onChange, className }) {
  return (
    <label className={cn("relative block min-w-0 flex-1", className)}>
      <span className="sr-only">Search employees</span>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search name, role, email…"
        className={cn(
          "h-10 w-full rounded-md border border-border bg-background pr-10 pl-10",
          "text-sm text-foreground outline-none transition placeholder:text-muted",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:bg-surface-elevated hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </label>
  );
}
