"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Sparkles, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { usePreferences } from "@/context/PreferencesContext";
import { apiFetch } from "@/utils/api";
import { cn } from "@/utils/cn";

const PROVIDER_META = {
  gemini: {
    title: "Gemini",
    description: "Google Gemini — fast Flash-Lite model for workplace Q&A.",
    keyLabel: "Gemini API key",
    keyPlaceholder: "AIza… or AQ.…",
    field: "geminiApiKey",
    clearField: "clearGemini",
  },
  openai: {
    title: "OpenAI",
    description: "OpenAI — GPT models for chat completions.",
    keyLabel: "OpenAI API key",
    keyPlaceholder: "sk-…",
    field: "openaiApiKey",
    clearField: "clearOpenai",
  },
};

export function AiModelSettings() {
  const { flashSaved } = usePreferences();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [keys, setKeys] = useState({ gemini: "", openai: "" });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/ai-settings");
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to load AI settings.");
        setSettings(null);
        return;
      }
      setSettings(data.settings);
    } catch {
      setError("Unable to load AI settings.");
      setSettings(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function selectProvider(id) {
    const provider = settings?.providers?.find((p) => p.id === id);
    if (!provider || provider.locked || saving) return;
    if (settings?.provider === id) return;

    setSaving(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/ai-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: id }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to switch provider.");
        return;
      }
      setSettings(data.settings);
      flashSaved("AI model updated");
    } catch {
      setError("Unable to switch provider.");
    } finally {
      setSaving(false);
    }
  }

  async function saveKey(providerId) {
    const meta = PROVIDER_META[providerId];
    const value = keys[providerId]?.trim();
    if (!meta || !value || saving) return;

    setSaving(true);
    setError("");
    try {
      const body = {
        [meta.field]: value,
        // Auto-select this provider once unlocked
        provider: providerId,
      };
      const res = await apiFetch("/api/auth/ai-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to save API key.");
        return;
      }
      setSettings(data.settings);
      setKeys((prev) => ({ ...prev, [providerId]: "" }));
      flashSaved(`${meta.title} key saved`);
    } catch {
      setError("Unable to save API key.");
    } finally {
      setSaving(false);
    }
  }

  async function clearKey(providerId) {
    const meta = PROVIDER_META[providerId];
    if (!meta || saving) return;

    setSaving(true);
    setError("");
    try {
      const res = await apiFetch("/api/auth/ai-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [meta.clearField]: true }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Unable to remove API key.");
        return;
      }
      setSettings(data.settings);
      flashSaved(`${meta.title} key removed`);
    } catch {
      setError("Unable to remove API key.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted">Loading AI model settings…</p>
    );
  }

  return (
    <section className="space-y-4">
      <header>
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          AI models
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          Choose a provider and add API keys. Keys stay on your account only.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-md bg-error/10 px-2.5 py-1.5 text-xs text-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div
        className="flex flex-col gap-1.5"
        role="group"
        aria-label="AI provider"
      >
        {(settings?.providers || []).map((provider) => {
          const meta = PROVIDER_META[provider.id];
          const active = settings?.provider === provider.id;
          const locked = provider.locked;

          return (
            <button
              key={provider.id}
              type="button"
              disabled={locked || saving}
              aria-pressed={active}
              onClick={() => selectProvider(provider.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-surface hover:border-border-strong",
                locked && "cursor-not-allowed opacity-75",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded",
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-elevated text-primary",
                )}
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {meta?.title || provider.label}
                </p>
                <p className="truncate text-[11px] text-muted">
                  {locked
                    ? "Add an API key below"
                    : meta?.description || "Ready"}
                </p>
              </div>
              {locked ? (
                <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted uppercase">
                  Off
                </span>
              ) : active ? (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-on-primary uppercase">
                  <Check className="h-2.5 w-2.5" aria-hidden />
                  On
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-semibold tracking-wide text-muted uppercase">
                  Ready
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-3 rounded-md border border-border bg-surface p-3">
        <div className="flex items-center gap-1.5">
          <KeyRound className="h-3.5 w-3.5 text-primary" aria-hidden />
          <h4 className="text-sm font-semibold text-foreground">API keys</h4>
        </div>
        <p className="text-[11px] leading-snug text-muted">
          Paste a key, then save. Saved keys are never shown again.
        </p>

        {(["gemini", "openai"]).map((id) => {
          const meta = PROVIDER_META[id];
          const provider = settings?.providers?.find((p) => p.id === id);
          return (
            <form
              key={id}
              className="space-y-2 rounded-md border border-border bg-background p-2.5"
              onSubmit={(event) => {
                event.preventDefault();
                saveKey(id);
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-foreground">
                  {meta.title}
                </p>
                {provider?.hasUserKey ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={saving}
                    onClick={() => clearKey(id)}
                    className="h-7 px-2 text-xs"
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
              <PasswordInput
                label={meta.keyLabel}
                name={`${id}-api-key`}
                autoComplete="off"
                placeholder={
                  provider?.hasUserKey
                    ? "Key saved — paste to replace"
                    : meta.keyPlaceholder
                }
                value={keys[id]}
                onChange={(e) =>
                  setKeys((prev) => ({ ...prev, [id]: e.target.value }))
                }
              />
              <Button
                type="submit"
                size="sm"
                loading={saving}
                disabled={!keys[id]?.trim()}
                className="h-8"
              >
                Save key
              </Button>
            </form>
          );
        })}
      </div>
    </section>
  );
}
