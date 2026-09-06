"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Palette,
  UserRound,
} from "lucide-react";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";
import { cn } from "@/utils/cn";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export function SettingsView() {
  const { user } = useAuth();
  const { profile, saveMessage } = usePreferences();
  const [section, setSection] = useState("profile");

  const displayName = user?.name || profile?.name || "You";
  const displayEmail = user?.email || profile?.email || "";
  const displayRole =
    user?.position || profile?.position || "Workspace member";
  const displayDept =
    user?.department || profile?.department || "";

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (SECTIONS.some((item) => item.id === hash)) {
      setSection(hash);
    }
  }, []);

  function selectSection(id) {
    setSection(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <FadeIn>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <div className="border-b border-border bg-primary px-5 py-7 text-white md:px-7 md:py-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  name={displayName}
                  size="lg"
                  className="ring-white/20"
                />
                <div>
                  <p className="text-caption text-white/70">Account</p>
                  <h2 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {displayName}
                  </h2>
                  <p className="mt-1 text-sm text-white/80">
                    {displayRole}
                    {displayDept ? (
                      <>
                        <span className="mx-1.5 text-white/40">·</span>
                        {displayDept}
                      </>
                    ) : null}
                  </p>
                  {displayEmail ? (
                    <p className="mt-1 text-xs text-white/60">
                      {displayEmail}
                    </p>
                  ) : null}
                </div>
              </div>
              {saveMessage ? (
                <Badge
                  tone="default"
                  className="self-start border-white/20 bg-white/10 text-white"
                >
                  {saveMessage}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="grid lg:grid-cols-[220px_1fr]">
            <nav
              className="flex gap-1 overflow-x-auto border-b border-border p-3 lg:flex-col lg:border-r lg:border-b-0 lg:p-4"
              aria-label="Settings sections"
            >
              {SECTIONS.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectSection(item.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      active
                        ? "bg-background text-foreground"
                        : "text-muted hover:bg-background hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="min-w-0 p-4 md:p-6">
              {section === "profile" ? <ProfileForm /> : null}
              {section === "appearance" ? <AppearanceSettings /> : null}
              {section === "notifications" ? <NotificationSettings /> : null}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
