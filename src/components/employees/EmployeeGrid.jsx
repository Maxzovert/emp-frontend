import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/motion/FadeIn";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-3.5 sm:px-5">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

export function EmployeeGrid({ employees, loading = false, onDeleted }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {Array.from({ length: 6 }).map((_, index) => (
          <RowSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <FadeIn>
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="hidden grid-cols-[auto_1fr_auto] gap-3 border-b border-border bg-background/70 px-5 py-2.5 text-[11px] font-semibold tracking-wide text-muted uppercase sm:grid sm:gap-4">
          <span className="w-10" />
          <span>Person</span>
          <span className="text-right">Actions</span>
        </div>
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onDeleted={onDeleted}
          />
        ))}
      </div>
    </FadeIn>
  );
}
