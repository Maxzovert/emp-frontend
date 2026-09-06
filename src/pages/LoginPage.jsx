import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Sign in to open your EmployeeAI workspace.
      </p>
      <Suspense fallback={<p className="mt-6 text-sm text-muted">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </>
  );
}
