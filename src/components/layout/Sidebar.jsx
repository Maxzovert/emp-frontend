"use client";

import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { APP_NAV } from "@/constants/navigation";
import { Button } from "@/components/ui/Button";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { cn } from "@/utils/cn";

const ICONS = {
  LayoutDashboard,
  Sparkles,
  Users,
  BarChart3,
  Settings,
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { openPanel } = useAssistantPanel();

  function go(href, event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    if (pathname === href) return;
    navigate(href);
  }

  return (
    <aside className="relative z-20 hidden h-full w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-background px-4 py-6 md:flex">
      <Link
        to="/"
        className={`mb-8 flex items-center gap-2.5 rounded-md px-2 ${focusRing}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
          EA
        </span>
        <span className="text-lg font-bold tracking-tight text-foreground">
          EmployeeAI
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Workspace">
        {APP_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={(event) => go(item.href, event)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                focusRing,
                active
                  ? "text-foreground"
                  : "text-muted hover:bg-surface hover:text-foreground",
              )}
            >
              {active ? (
                <span className="absolute inset-0 rounded-md bg-surface transition-colors" />
              ) : null}
              <span className="relative z-10 flex items-center gap-3">
                {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-border bg-surface p-4">
        <p className="text-xs font-semibold text-foreground">Need a hand?</p>
        <p className="mt-1 text-[11px] text-muted">
          Ask the workplace assistant about people and teams.
        </p>
        <Button
          type="button"
          className="mt-3 w-full"
          size="sm"
          onClick={openPanel}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Ask AI
        </Button>
      </div>
    </aside>
  );
}
