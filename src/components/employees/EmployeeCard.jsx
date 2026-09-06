"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { apiFetch } from "@/utils/api";

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "away", label: "Away" },
  { value: "inactive", label: "Inactive" },
];

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "active") return "success";
  if (value === "away") return "warning";
  return "default";
}

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

export function EmployeeCard({
  employee,
  onDeleted,
  onStatusUpdated,
  className,
}) {
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
    <article
      className={cn(
        "border-b border-border px-4 py-4 transition hover:bg-background/90 last:border-b-0 sm:px-5",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar name={employee.name} src={employee.avatar} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {employee.name}
            </h3>
            <Badge
              tone={statusTone(status)}
              dot
              className="capitalize"
            >
              {status}
            </Badge>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {employee.position}
            <span className="mx-1.5 text-border">·</span>
            <span className="font-medium text-primary">
              {employee.department}
            </span>
          </p>
          <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted">
            <Mail className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{employee.email}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          aria-label={`Status for ${employee.name}`}
          value={status}
          disabled={saving || deleting}
          onChange={handleStatusChange}
          className={cn(
            "h-9 min-w-0 flex-1 rounded-md border px-2 text-xs font-semibold capitalize outline-none transition",
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

        {confirming ? (
          <div className="flex flex-wrap gap-1.5">
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
            className="shrink-0 text-muted hover:bg-error/10 hover:text-error"
            onClick={handleDelete}
            aria-label={`Delete ${employee.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {error ? (
        <p className="mt-2 text-[11px] text-error" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  );
}
