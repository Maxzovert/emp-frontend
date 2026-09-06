import { RegisterForm } from "@/components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Register with Neon-backed auth to unlock the workspace.
      </p>
      <RegisterForm />
    </>
  );
}
