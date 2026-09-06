"use client";

import { EMAIL_NOTIFICATIONS_CONFIGURED } from "@/constants/notifications";
import { Badge } from "@/components/ui/Badge";
import { Toggle } from "@/components/ui/Toggle";
import { usePreferences } from "@/context/PreferencesContext";

export function NotificationSettings() {
  const { notifications, setNotifications, ready, flashSaved } =
    usePreferences();

  function update(key, value) {
    if (key === "email" && !EMAIL_NOTIFICATIONS_CONFIGURED) return;
    setNotifications((prev) => ({ ...prev, [key]: value }));
    flashSaved("Notification preferences saved");
  }

  return (
    <section>
      <header className="mb-5">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Notifications
        </h3>
        <p className="mt-1 text-sm text-muted">
          Control which updates you want. Saved locally in this browser.
        </p>
      </header>

      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        <div className="bg-surface px-4 py-4">
          <Toggle
            id="notify-email"
            label="Email notifications"
            description={
              EMAIL_NOTIFICATIONS_CONFIGURED
                ? "Occasional summaries and account messages."
                : "Email delivery is not configured for this workspace."
            }
            checked={
              EMAIL_NOTIFICATIONS_CONFIGURED
                ? Boolean(notifications.email)
                : false
            }
            disabled={!ready || !EMAIL_NOTIFICATIONS_CONFIGURED}
            onChange={(value) => update("email", value)}
          />
          {!EMAIL_NOTIFICATIONS_CONFIGURED ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="warning">Not configured</Badge>
              <p className="text-xs text-muted">
                Enable later with an email provider and{" "}
                <code className="rounded bg-background px-1 py-0.5 text-[11px]">
                  VITE_EMAIL_NOTIFICATIONS=true
                </code>
                .
              </p>
            </div>
          ) : null}
        </div>

        <div className="bg-surface px-4 py-4">
          <Toggle
            id="notify-ai"
            label="AI updates"
            description="Tips when the assistant has useful workplace insights."
            checked={Boolean(notifications.aiUpdates)}
            disabled={!ready}
            onChange={(value) => update("aiUpdates", value)}
          />
        </div>

        <div className="bg-surface px-4 py-4">
          <Toggle
            id="notify-announcements"
            label="Company announcements"
            description="Product and workspace news for the team."
            checked={Boolean(notifications.announcements)}
            disabled={!ready}
            onChange={(value) => update("announcements", value)}
          />
        </div>
      </div>
    </section>
  );
}
