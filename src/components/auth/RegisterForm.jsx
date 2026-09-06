"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/context/AuthContext";

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    position: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await register(form);
      if (!result.success) {
        setError(result.error || "Unable to create account.");
        return;
      }
      navigate("/dashboard");
    } catch {
      setError("Unable to create account right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        label="Name"
        name="name"
        autoComplete="name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(e) => updateField("email", e.target.value)}
        required
      />
      <PasswordInput
        name="password"
        autoComplete="new-password"
        hint="At least 8 characters"
        value={form.password}
        onChange={(e) => updateField("password", e.target.value)}
        required
        minLength={8}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Department"
          name="department"
          value={form.department}
          onChange={(e) => updateField("department", e.target.value)}
        />
        <Input
          label="Position"
          name="position"
          value={form.position}
          onChange={(e) => updateField("position", e.target.value)}
        />
      </div>

      {error ? (
        <p className="rounded-xl bg-error/10 px-3 py-2 text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" loading={loading}>
        Create account
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
