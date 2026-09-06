"use client";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Bell, LogOut, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { APP_NAV } from "@/constants/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Header() {
  const { pathname } = useLocation();
  const { theme, toggleTheme, ready } = useTheme();
  const { user, logout } = useAuth();
  const { profile } = usePreferences();
  const { open, togglePanel } = useAssistantPanel();

  const current = APP_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  const title = current?.label ?? "Workspace";
  const displayName = user?.name || profile?.name || "User";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background px-3 sm:h-16 sm:gap-3 sm:px-4 md:px-6">
      <div className="min-w-0">
        <p className="text-caption text-muted">EmployeeAI</p>
        <h1 className="truncate text-sm font-semibold text-foreground sm:text-base md:text-lg">
          {title}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={togglePanel}
          className={cn(
            `inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-medium transition ${focusRing}`,
            open
              ? "border-primary bg-primary text-white"
              : "border-border bg-surface text-muted hover:text-foreground",
          )}
          aria-label={open ? "Hide AI assistant" : "Show AI assistant"}
          aria-pressed={open}
          title={open ? "Hide assistant" : "Show assistant"}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">AI</span>
        </button>
        <Link
          to="/settings"
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:text-foreground ${focusRing}`}
          aria-label="Notification preferences"
          title="Manage notification preferences"
        >
          <Bell className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          disabled={!ready}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground transition hover:bg-surface-elevated disabled:opacity-60 ${focusRing}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
        <Link
          to="/settings"
          className={`hidden items-center gap-2 rounded-md border border-border bg-surface py-1.5 pr-3 pl-1.5 sm:flex ${focusRing}`}
          aria-label="Open profile settings"
        >
          <Avatar name={displayName} size="sm" />
          <span className="text-xs font-medium text-foreground">
            {displayName.split(" ")[0]}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:text-error ${focusRing}`}
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
