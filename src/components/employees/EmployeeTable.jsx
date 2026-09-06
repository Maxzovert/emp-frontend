"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { FadeIn } from "@/components/motion/FadeIn";
import { cn } from "@/utils/cn";
import { apiFetch } from "@/utils/api";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "away", label: "Away" },
  { value: "inactive", label: "Inactive" },
];

function statusSelectClass(status) {
  const value = String(status || "").toLowerCase();
  if (value === "active") {
    return "border-success/40 bg-success/10 text-success";
  }
  if (value === "away") {
    return "border-warning/40 bg-warning/10 text-warning";
  }
  return "border-border bg-surface text-muted";
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="border-b border-border bg-background/70 px-4 py-3">
        <Skeleton className="h-3 w-40" />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.4fr_1fr_1fr_1.2fr_7.5rem_3rem] items-center gap-3 border-b border-border px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function EmployeeRow({ employee, onDeleted, onStatusUpdated }) {
  const [status, setStatus] = useState(employee.status);
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(employee.status);
  }, [employee.status]);

  async function handleStatusChange(event) {
    const nextStatus = event.target.value;
    const previous = status;
    setStatus(nextStatus);
    setSaving(true);
    setError("");

    try {
      const res = await apiFetch(
        `/api/employees/${encodeURIComponent(employee.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        },
      );
      const data = await res.json();
      if (!data.success) {
        setStatus(previous);
        setError(data.error || "Unable to update status.");
        return;
      }
      onStatusUpdated?.(data.employee || { ...employee, status: nextStatus });
    } catch {
      setStatus(previous);
      setError("Unable to update status.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setError("");
      return;
    }

    setDeleting(true);
    setError("");
    try {
      const res = await apiFetch(
        `/api/employees/${encodeURIComponent(employee.id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to delete.");
        setConfirming(false);
        return;
      }
      onDeleted?.(employee.id);
    } catch {
      setError("Unable to delete.");
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <tr className="border-b border-border transition hover:bg-background/80 last:border-b-0">
      <td className="px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={employee.name} src={employee.avatar} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {employee.name}
            </p>
            {employee.joinedAt ? (
              <p className="truncate text-[11px] text-muted">
                Joined {employee.joinedAt}
              </p>
            ) : null}
          </div>
        </div>
      </td>
      <td className="hidden px-4 py-3 text-sm text-foreground md:table-cell">
        {employee.position}
      </td>
      <td className="hidden px-4 py-3 text-sm font-medium text-primary sm:table-cell">
        {employee.department}
      </td>
      <td className="hidden px-4 py-3 text-sm text-muted lg:table-cell">
        <span className="truncate">{employee.email}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex min-w-[7.5rem] flex-col gap-1">
          <select
            aria-label={`Status for ${employee.name}`}
            value={status}
            disabled={saving || deleting}
            onChange={handleStatusChange}
            className={cn(
              "h-9 w-full rounded-md border px-2 text-xs font-semibold capitalize outline-none transition",
              "focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60",
              statusSelectClass(status),
            )}
          >
            {STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error ? (
            <p className="text-[10px] text-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-3 text-right">
        {confirming ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            <Button
              size="sm"
              variant="destructive"
              loading={deleting}
              onClick={handleDelete}
            >
              Confirm
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={deleting}
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="text-muted hover:bg-error/10 hover:text-error"
            onClick={handleDelete}
            aria-label={`Delete ${employee.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </td>
    </tr>
  );
}

export function EmployeeTable({
  employees,
  loading = false,
  onDeleted,
  onStatusUpdated,
}) {
  if (loading) return <TableSkeleton />;

  return (
    <FadeIn>
      <div className="overflow-x-auto rounded-lg border border-border bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-background/70 text-[11px] font-semibold tracking-wide text-muted uppercase">
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="hidden px-4 py-2.5 font-semibold md:table-cell">
                Position
              </th>
              <th className="hidden px-4 py-2.5 font-semibold sm:table-cell">
                Department
              </th>
              <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">
                Email
              </th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
                onDeleted={onDeleted}
                onStatusUpdated={onStatusUpdated}
              />
            ))}
          </tbody>
        </table>
      </div>
    </FadeIn>
  );
}
