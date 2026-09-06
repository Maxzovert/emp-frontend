import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-x-clip bg-background px-4 py-8 sm:py-10">
      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">
            EA
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            EmployeeAI
          </span>
        </Link>
        <div className="rounded-lg border border-border bg-surface p-5 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
