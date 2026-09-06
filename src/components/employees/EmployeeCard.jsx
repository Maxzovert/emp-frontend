"use client";

import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { apiFetch } from "@/utils/api";

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "active") return "success";
  if (value === "away") return "warning";
  return "default";
}

export function EmployeeCard({ employee, onDeleted, className }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

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
        "group grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border px-4 py-3.5 transition hover:bg-background/90 sm:gap-4 sm:px-5",
        className,
      )}
    >
      <Avatar name={employee.name} src={employee.avatar} size="md" />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {employee.name}
          </h3>
          <Badge
            tone={statusTone(employee.status)}
            dot
            className="capitalize"
          >
            {employee.status}
          </Badge>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {employee.position}
          <span className="mx-1.5 text-border">·</span>
          <span className="font-medium text-primary">
            {employee.department}
          </span>
        </p>
        <p className="mt-1 hidden truncate text-xs text-muted sm:flex sm:items-center sm:gap-1.5">
          <Mail className="h-3 w-3 shrink-0" aria-hidden />
          {employee.email}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
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
            className="text-muted opacity-70 transition group-hover:opacity-100 hover:bg-error/10 hover:text-error"
            onClick={handleDelete}
            aria-label={`Delete ${employee.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {employee.joinedAt ? (
          <p className="hidden text-[10px] text-muted md:block">
            Joined {employee.joinedAt}
          </p>
        ) : null}
        {error ? (
          <p className="max-w-[8rem] text-right text-[10px] text-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </article>
  );
}
