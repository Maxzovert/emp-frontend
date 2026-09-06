"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardDescription, CardTitle } from "@/components/ui/Card";
import { CHART_COLORS } from "@/utils/analyticsUtils";

export function DepartmentPieChart({ data = [] }) {
  return (
    <Card className="h-full">
      <CardTitle>Department mix</CardTitle>
      <CardDescription>
        Share of workforce by department (pie chart).
      </CardDescription>

      <div className="mt-6 h-72 w-full">
        {data.length === 0 ? (
          <p className="text-sm text-muted">No department data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="48%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={3}
                stroke="var(--color-surface)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                  fontSize: 12,
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "var(--color-text-secondary)", fontSize: 12 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
