"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FadeIn } from "@/components/motion/FadeIn";
import { Users } from "lucide-react";

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "active") return "success";
  if (value === "away") return "warning";
  return "default";
}

export function RecentEmployees({ employees = [] }) {
  return (
    <FadeIn delay={0.1}>
      <section className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5 md:px-6">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              People nearby
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Latest teammates from your directory
            </p>
          </div>
          <Button href="/employees" variant="secondary" size="sm">
            Full directory
          </Button>
        </div>

        {!employees.length ? (
          <EmptyState
            icon={Users}
            title="No people yet"
            description="Seed or add employees to fill this list."
            className="border-0 bg-transparent py-10 shadow-none"
          />
        ) : (
          <ul className="divide-y divide-border">
            {employees.map((employee) => (
              <li
                key={employee.id}
                className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-background sm:px-5 md:px-6"
              >
                <Avatar name={employee.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {employee.name}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {employee.position}
                    <span className="mx-1.5 text-border">/</span>
                    {employee.department}
                  </p>
                </div>
                <Badge
                  tone={statusTone(employee.status)}
                  dot
                  className="hidden shrink-0 capitalize sm:inline-flex"
                >
                  {employee.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </FadeIn>
  );
}
