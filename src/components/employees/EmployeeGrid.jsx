import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/motion/FadeIn";

function RowSkeleton() {
  return (
    <div className="border-b border-border px-4 py-4 sm:px-5">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    </div>
  );
}

export function EmployeeGrid({
  employees,
  loading = false,
  onDeleted,
  onStatusUpdated,
}) {
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
        {employees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onDeleted={onDeleted}
            onStatusUpdated={onStatusUpdated}
          />
        ))}
      </div>
    </FadeIn>
  );
}
