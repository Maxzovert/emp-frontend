"use client";

import { DepartmentBarChart } from "@/components/analytics/DepartmentBarChart";
import { DepartmentPieChart } from "@/components/analytics/DepartmentPieChart";
import { DepartmentOverview } from "@/components/analytics/DepartmentOverview";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";
import {
  getDepartmentCounts,
  getDepartmentOverview,
  getWorkforceStats,
} from "@/utils/analyticsUtils";

export function AnalyticsView({ employees = [], source = "demo" }) {
  const stats = getWorkforceStats(employees);
  const departmentCounts = getDepartmentCounts(employees);
  const overview = getDepartmentOverview(employees);
  const activeShare = stats.total ? stats.active / stats.total : 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <FadeIn>
        <PageHeader
          eyebrow="Insights"
          title="Analytics"
          description="Workforce metrics derived from the same employee dataset as the directory and dashboard."
          actions={
            <Badge tone={source === "neon" ? "success" : "warning"}>
              {source === "neon" ? "Neon" : "Demo data"}
            </Badge>
          }
        />
      </FadeIn>

      {!employees.length ? (
        <EmptyState
          icon={Users}
          title="No analytics data"
          description={
            source === "neon"
              ? "Seed your Neon database with npm run db:seed."
              : "Employee records are required to build charts."
          }
        />
      ) : (
        <>
          <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StaggerItem>
              <StatCard
                label="Total employees"
                value={String(stats.total)}
                delta={`${stats.departments} depts`}
                deltaTone="primary"
                accent="chart2"
                progress={0.8}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Active employees"
                value={String(stats.active)}
                delta={`${Math.round(activeShare * 100)}%`}
                accent="primary"
                progress={activeShare}
              />
            </StaggerItem>
            <StaggerItem>
              <StatCard
                label="Departments"
                value={String(stats.departments)}
                delta={`${stats.away} away`}
                deltaTone="warning"
                accent="chart3"
                progress={Math.min(1, stats.departments / 8)}
              />
            </StaggerItem>
          </Stagger>

          <FadeIn delay={0.08}>
            <div className="grid gap-4 lg:grid-cols-2">
              <DepartmentBarChart data={departmentCounts} />
              <DepartmentPieChart data={departmentCounts} />
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <DepartmentOverview rows={overview} />
          </FadeIn>
        </>
      )}
    </div>
  );
}
