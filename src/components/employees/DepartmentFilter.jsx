"use client";

import { Filter } from "lucide-react";
import { cn } from "@/utils/cn";

export function DepartmentFilter({
  departments = [],
  value = "all",
  onChange,
  className,
}) {
  const options = ["all", ...departments];

  return (
    <label
      className={cn("relative block w-full shrink-0 sm:w-[220px]", className)}
    >
      <span className="sr-only">Filter by department</span>
      <Filter
        className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Filter by department"
        className={cn(
          "h-10 w-full appearance-none rounded-md border border-border bg-background py-2 pr-9 pl-9",
          "text-sm text-foreground outline-none transition",
          "focus:border-primary focus:ring-1 focus:ring-primary",
          value !== "all" ? "border-primary/50 text-foreground" : "text-muted",
        )}
      >
        {options.map((department) => (
          <option key={department} value={department}>
            {department === "all" ? "All departments" : department}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted"
        aria-hidden
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
