"use client";

import {
  BarChart3,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { APP_NAV } from "@/constants/navigation";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { cn } from "@/utils/cn";

const ICONS = {
  LayoutDashboard,
  Sparkles,
  Users,
  BarChart3,
  Settings,
};

export function MobileNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { open, openPanel } = useAssistantPanel();

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
    <nav
      className="fixed right-0 bottom-0 left-0 z-40 flex border-t border-border bg-background px-1 py-1 md:hidden"
      aria-label="Primary"
    >
      {APP_NAV.map((item) => {
        const Icon = ICONS[item.icon];
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={(event) => go(item.href, event)}
            className={cn(
              "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              active ? "text-primary" : "text-muted hover:text-foreground",
            )}
          >
            {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={openPanel}
        className={cn(
          "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-2 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          open ? "text-primary" : "text-muted hover:text-foreground",
        )}
        aria-label="Open AI assistant"
        aria-pressed={open}
      >
        <Sparkles className="h-5 w-5" aria-hidden />
        <span className="truncate">AI</span>
      </button>
    </nav>
  );
}
