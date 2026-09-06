import { Badge } from "@/components/ui/Badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Building2 } from "lucide-react";

export function DepartmentOverview({ rows = [] }) {
  return (
    <Card>
      <CardTitle>Department overview</CardTitle>
      <CardDescription>
        Totals and active headcount per department.
      </CardDescription>

      {!rows.length ? (
        <EmptyState
          icon={Building2}
          title="No departments yet"
          description="Seed employees to populate this overview."
          className="mt-4 border-0 bg-transparent py-8 shadow-none"
        />
      ) : (
        <>
          <ul className="mt-5 space-y-3 sm:hidden">
            {rows.map((row) => (
              <li
                key={row.department}
                className="rounded-lg border border-border bg-background px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate font-medium text-foreground">
                    {row.department}
                  </p>
                  <Badge tone="success" className="shrink-0">
                    {row.active} active
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {row.total} total · {Math.round(row.share * 100)}% of workforce
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Active</th>
                  <th className="pb-3 font-semibold">Share</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.department}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="py-3 font-medium text-foreground">
                      {row.department}
                    </td>
                    <td className="py-3 text-muted">{row.total}</td>
                    <td className="py-3">
                      <Badge tone="success">{row.active} active</Badge>
                    </td>
                    <td className="py-3 text-muted">
                      {Math.round(row.share * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}
