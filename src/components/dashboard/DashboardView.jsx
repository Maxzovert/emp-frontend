"use client";

import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { AIOverviewCard } from "@/components/dashboard/AIOverviewCard";
import { RecentEmployees } from "@/components/dashboard/RecentEmployees";
import { MetricStrip } from "@/components/dashboard/MetricStrip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { usePreferences } from "@/context/PreferencesContext";
import { getWorkforceStats } from "@/utils/analyticsUtils";
import { Users } from "lucide-react";

export function DashboardView({ employees = [], source = "demo" }) {
  const { profile } = usePreferences();
  const stats = getWorkforceStats(employees);
  const recent = employees.slice(0, 7);
  const activeShare = stats.total
    ? Math.round((stats.active / stats.total) * 100)
    : 0;

  if (!employees.length) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <WelcomeSection name={profile.name} />
        <EmptyState
          icon={Users}
          title="No employees yet"
          description={
            source === "neon"
              ? "Your Neon database is empty. Run npm run db:seed to load demo people."
              : "Employee data could not be loaded."
          }
          actionLabel="Open directory"
          onAction={() => {
            window.location.href = "/employees";
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <WelcomeSection name={profile.name} />

      <MetricStrip
        items={[
          {
            label: "Headcount",
            value: String(stats.total),
            hint: `${stats.departments} departments`,
          },
          {
            label: "Active",
            value: String(stats.active),
            hint: `${activeShare}% of team`,
          },
          {
            label: "Away",
            value: String(stats.away),
            hint: "Temporarily offline",
          },
          {
            label: "Inactive",
            value: String(stats.inactive),
            hint: "Not currently active",
          },
        ]}
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <AIOverviewCard />
        <RecentEmployees employees={recent} />
      </div>

      <div className="flex justify-end">
        <Button href="/analytics" variant="secondary" size="sm">
          Open analytics
        </Button>
      </div>
    </div>
  );
}
