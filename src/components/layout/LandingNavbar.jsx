"use client";

import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const links = [
  { href: "#features", label: "Features" },
  { href: "#preview", label: "Preview" },
  { href: "#about", label: "About" },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, ready } = useTheme();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to="/" className={`flex items-center gap-2.5 ${focusRing} rounded-md`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
            EA
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            EmployeeAI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-md transition hover:text-foreground ${focusRing}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            disabled={!ready}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition disabled:opacity-60 ${focusRing}`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Sign in
          </Button>
          <Button href="/register" size="sm" className="hidden sm:inline-flex">
            Get started
          </Button>

          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface md:hidden ${focusRing}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-surface md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-3 text-sm font-medium text-muted hover:bg-background hover:text-foreground ${focusRing}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            href="/login"
            className="mt-1 w-full"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
}
