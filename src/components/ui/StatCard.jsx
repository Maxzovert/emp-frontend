import { cn } from "@/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

const accentBars = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  chart1: "bg-chart-1",
  chart2: "bg-chart-2",
  chart3: "bg-chart-3",
};

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "success",
  progress = 0.65,
  accent = "primary",
  className,
}) {
  const width = Math.max(0, Math.min(1, Number(progress) || 0)) * 100;

  return (
    <Card className={cn("relative overflow-hidden", className)} padding="md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        {delta != null ? (
          <Badge tone={deltaTone} className="shrink-0">
            {delta}
          </Badge>
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-background">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            accentBars[accent] || accentBars.primary,
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </Card>
  );
}
