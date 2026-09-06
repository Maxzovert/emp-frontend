"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { usePreferences } from "@/context/PreferencesContext";

export function ProfileForm() {
  const { user, ready: authReady, updateProfile } = useAuth();
  const { profile, setProfile, ready, flashSaved } = usePreferences();
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!ready || !authReady) return;
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        department: user.department || "",
        position: user.position || "",
      });
      return;
    }
    setForm(profile);
  }, [ready, authReady, user, profile]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.name?.trim()) next.name = "Name is required.";
    if (!form.email?.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email.";
    }
    if (!form.department?.trim()) next.department = "Department is required.";
    if (!form.position?.trim()) next.position = "Position is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSaving(true);
    const next = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
    };

    try {
      if (user) {
        const result = await updateProfile(next);
        if (!result.success) {
          setFormError(result.error || "Unable to update profile.");
          return;
        }
        setProfile(result.user);
        flashSaved("Profile saved");
      } else {
        setProfile(next);
        flashSaved("Profile saved locally");
      }
    } catch {
      setFormError("Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  const formReady = ready && authReady;

  return (
    <section>
      <header className="mb-5">
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          Profile
        </h3>
        <p className="mt-1 text-sm text-muted">
          {user
            ? "Update how you appear across the workspace. Saved to your account."
            : "Update how you appear across the workspace. Saved in this browser."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          value={form.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          error={errors.name}
          disabled={!formReady}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email || ""}
          onChange={(e) => updateField("email", e.target.value)}
          error={errors.email}
          disabled={!formReady}
        />
        <Input
          label="Department"
          name="department"
          value={form.department || ""}
          onChange={(e) => updateField("department", e.target.value)}
          error={errors.department}
          disabled={!formReady}
        />
        <Input
          label="Position"
          name="position"
          value={form.position || ""}
          onChange={(e) => updateField("position", e.target.value)}
          error={errors.position}
          disabled={!formReady}
        />

        {formError ? (
          <p
            className="sm:col-span-2 rounded-xl bg-error/10 px-3 py-2 text-sm text-error"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <div className="sm:col-span-2">
          <Button type="submit" loading={saving} disabled={!formReady}>
            Save profile
          </Button>
        </div>
      </form>
    </section>
  );
}
