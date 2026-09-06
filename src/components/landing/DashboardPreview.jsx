"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

const stats = [
  { label: "Employees", value: "28" },
  { label: "Active", value: "24" },
  { label: "Departments", value: "6" },
];

const prompts = [
  "Who works in Engineering?",
  "Show workforce statistics",
  "Find a Product Manager",
];

export function DashboardPreview() {
  const ref = useRef(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
  }, []);

  useEffect(() => {
    if (reduce || !ref.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
      );
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className="relative">
      <div className="relative overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border bg-surface-soft px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-error/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="ml-3 font-mono text-[11px] text-muted">
            employeeai.app/dashboard
          </span>
        </div>

        <div className="grid gap-0 md:grid-cols-[7.5rem_1fr]">
          <aside className="hidden border-r border-border bg-surface-soft p-3 md:block">
            <div className="mb-4 flex items-center gap-2 px-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                EA
              </span>
              <span className="text-xs font-semibold">EmployeeAI</span>
            </div>
            {["Overview", "Assistant", "Employees", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className={cn(
                    "mb-1 rounded-md px-2 py-1.5 text-[11px] font-medium",
                    i === 0
                      ? "bg-surface-elevated text-foreground"
                      : "text-muted",
                  )}
                >
                  {item}
                </div>
              ),
            )}
          </aside>

          <div className="space-y-3 p-3 sm:p-4">
            <div className="grid grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <p className="text-[10px] text-muted">{stat.label}</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-primary">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border bg-background p-3">
              <p className="text-xs font-semibold text-foreground">
                AI Assistant
              </p>
              <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-body">
{`> who works in Engineering?
Ada Lovelace · Active
Grace Hopper · Away`}
              </pre>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {prompts.map((prompt) => (
                  <span
                    key={prompt}
                    className="rounded-md border border-border bg-surface px-2 py-1 text-[10px] text-muted"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
              <div>
                <p className="text-[11px] font-medium text-foreground">
                  Ada Lovelace
                </p>
                <p className="text-[10px] text-muted">Engineering · Active</p>
              </div>
              <Badge tone="success" dot className="text-[9px]">
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
