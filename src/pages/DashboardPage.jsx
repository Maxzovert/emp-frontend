import { useEffect, useState } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { apiFetch } from "@/utils/api";

export function DashboardPage() {
  const [employees, setEmployees] = useState([]);
  const [source, setSource] = useState("demo");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await apiFetch("/api/employees");
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setEmployees(Array.isArray(data.employees) ? data.employees : []);
          setSource(data.source || "demo");
        }
      } catch (error) {
        console.warn("[DashboardPage]", error?.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-muted">
        Loading dashboard…
      </div>
    );
  }

  return <DashboardView employees={employees} source={source} />;
}
