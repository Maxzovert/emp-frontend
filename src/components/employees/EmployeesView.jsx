"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";
import { DepartmentFilter } from "@/components/employees/DepartmentFilter";
import { EmployeeSearch } from "@/components/employees/EmployeeSearch";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Badge } from "@/components/ui/Badge";
import { FadeIn } from "@/components/motion/FadeIn";
import {
  filterEmployees,
  getDepartmentsFromList,
} from "@/utils/employeeUtils";

export function EmployeesView() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [source, setSource] = useState("demo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("all");
  const [addOpen, setAddOpen] = useState(false);

  async function loadEmployees() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/employees");
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Unable to load employees.");
      }

      setEmployees(data.employees || []);
      setDepartments(data.departments || []);
      setSource(data.source || "demo");
    } catch (err) {
      setError(err.message || "Unable to load employees.");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = useMemo(
    () => filterEmployees(employees, { query, department }),
    [employees, query, department],
  );

  function handleCreated(employee) {
    setEmployees((prev) => {
      const next = [employee, ...prev.filter((item) => item.id !== employee.id)];
      setDepartments(getDepartmentsFromList(next));
      return next;
    });
  }

  function handleDeleted(id) {
    setEmployees((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setDepartments(getDepartmentsFromList(next));
      return next;
    });
  }

  function handleStatusUpdated(employee) {
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === employee.id ? { ...item, ...employee } : item,
      ),
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <FadeIn>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-caption text-primary">Directory</p>
            <h2 className="mt-2 text-h1 text-foreground">People</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Search the roster, filter by department, and update status in place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={source === "neon" ? "success" : "warning"}>
              {source === "neon" ? "Live Neon" : "Demo data"}
            </Badge>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add person
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <EmployeeSearch value={query} onChange={setQuery} />
          <DepartmentFilter
            departments={departments}
            value={department}
            onChange={setDepartment}
          />
          {!loading && !error ? (
            <p className="shrink-0 text-xs text-muted sm:ml-auto sm:text-right">
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>
              <span className="text-muted"> / {employees.length}</span>
            </p>
          ) : null}
        </div>
      </FadeIn>

      {error ? (
        <ErrorState
          title="Couldn't load employees"
          description={error}
          onRetry={loadEmployees}
        />
      ) : null}

      {!error && loading ? <EmployeeTable loading /> : null}

      {!error && !loading && filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No matches"
          description={
            employees.length === 0
              ? "Add your first teammate to build the directory."
              : "Try a different name, role, or department filter."
          }
          actionLabel={employees.length === 0 ? "Add person" : "Clear filters"}
          onAction={() => {
            if (employees.length === 0) {
              setAddOpen(true);
              return;
            }
            setQuery("");
            setDepartment("all");
          }}
        />
      ) : null}

      {!error && !loading && filtered.length > 0 ? (
        <EmployeeTable
          employees={filtered}
          onDeleted={handleDeleted}
          onStatusUpdated={handleStatusUpdated}
        />
      ) : null}

      <AddEmployeeDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={handleCreated}
        departments={departments}
      />
    </div>
  );
}
