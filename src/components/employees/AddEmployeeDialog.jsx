"use client";

import { useEffect, useId, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import { apiFetch } from "@/utils/api";

const DEFAULT_DEPARTMENTS = [
  "Engineering",
  "Product",
  "People",
  "Marketing",
  "Operations",
  "Analytics",
  "Leadership",
];

const STATUSES = [
  { value: "active", label: "Active" },
  { value: "away", label: "Away" },
  { value: "inactive", label: "Inactive" },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  position: "",
  status: "active",
};

export function AddEmployeeDialog({
  open,
  onClose,
  onCreated,
  departments = [],
}) {
  const titleId = useId();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const departmentOptions = [
    ...new Set([...DEFAULT_DEPARTMENTS, ...departments].filter(Boolean)),
  ].sort();

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_FORM);
    setErrors({});
    setFormError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event) {
      if (event.key === "Escape" && !saving) onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, saving]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSaving(true);

    try {
      const res = await apiFetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setErrors(data.errors || {});
        setFormError(data.error || "Unable to add employee.");
        return;
      }

      onCreated?.(data.employee);
      onClose?.();
    } catch {
      setFormError("Unable to add employee.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[min(92dvh,40rem)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 sm:rounded-lg md:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              Add employee
            </h2>
            <p className="mt-1 text-sm text-muted">
              Create a new directory profile for your team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2 text-muted transition hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            autoFocus
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex w-full flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Department
              </span>
              <select
                name="department"
                value={form.department}
                onChange={(e) => updateField("department", e.target.value)}
                className={cn(
                  "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-foreground outline-none transition",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  errors.department ? "border-error" : "border-border",
                )}
                required
              >
                <option value="">Select department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department ? (
                <span className="text-xs text-error">{errors.department}</span>
              ) : null}
            </label>

            <Input
              label="Position"
              name="position"
              value={form.position}
              onChange={(e) => updateField("position", e.target.value)}
              error={errors.position}
              required
            />
          </div>

          <label className="flex w-full flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Status</span>
            <select
              name="status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          {formError ? (
            <p className="text-sm text-error" role="alert">
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
