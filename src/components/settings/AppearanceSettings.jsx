"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/utils/cn";

const OPTIONS = [
  {
    id: "dark",
    label: "Dark",
    description: "Near-black canvas with navy accents",
    icon: Moon,
    preview: "bg-[#0a0a0a] text-white",
    chip: "bg-[#2b5797]",
  },
  {
    id: "light",
    label: "Light",
    description: "Paper surfaces with navy accents",
    icon: Sun,
    preview: "bg-[#f3f5f8] text-[#0a0a0a]",
    chip: "bg-[#0b2545]",
  },
];

export function AppearanceSettings() {
  const { theme, setTheme, ready } = useTheme();

  return (
    <section>
      <header className="mb-5">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Appearance
        </h3>
        <p className="mt-1 text-sm text-muted">
          Dark / light preference persists across refreshes. Light is the default.
        </p>
      </header>

      <div
        className="grid gap-3 sm:grid-cols-2"
        role="group"
        aria-label="Theme"
      >
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const active = theme === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={!ready}
              aria-pressed={active}
              onClick={() => setTheme(option.id)}
              className={cn(
                "overflow-hidden rounded-lg border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active ? "border-primary" : "border-border hover:border-border-strong",
                !ready && "opacity-60",
              )}
            >
              <div
                className={cn(
                  "flex h-20 items-end justify-between px-4 pb-3",
                  option.preview,
                )}
              >
                <span
                  className={cn("h-6 w-6 rounded-md", option.chip)}
                  aria-hidden
                />
                <Icon className="h-4 w-4 opacity-70" aria-hidden />
              </div>
              <div className="bg-surface px-4 py-3">
                <span className="block text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-xs text-muted">
                  {option.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
