"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Mic,
  MicOff,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/utils/api";
import { cn } from "@/utils/cn";

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function joinParts(...parts) {
  return parts
    .map((part) => String(part || "").trim())
    .filter(Boolean)
    .join(" ");
}

const INPUT_MIN_H = 24;
const INPUT_MAX_H = 120;

function autoSizeTextarea(el) {
  if (!el) return;
  el.style.height = `${INPUT_MIN_H}px`;
  el.style.overflowY = "hidden";
  if (!el.value) return;
  const raw = el.scrollHeight;
  el.style.height = `${Math.min(raw, INPUT_MAX_H)}px`;
  el.style.overflowY = raw > INPUT_MAX_H ? "auto" : "hidden";
}

export function ChatInput({ onSend, disabled = false, loading = false }) {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [aiSettings, setAiSettings] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [providerSaving, setProviderSaving] = useState(false);
  const [providerOpen, setProviderOpen] = useState(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const providerMenuRef = useRef(null);
  const valueRef = useRef("");
  const baseTextRef = useRef("");
  const finalTextRef = useRef("");
  const wantListenRef = useRef(false);

  const loadAiSettings = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await apiFetch("/api/auth/ai-settings");
      const data = await res.json();
      if (data.success) {
        setAiSettings(data.settings);
      } else {
        setAiSettings(null);
      }
    } catch {
      setAiSettings(null);
    } finally {
      setAiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAiSettings();
  }, [loadAiSettings]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (!providerOpen) return undefined;
    function onPointerDown(event) {
      if (!providerMenuRef.current?.contains(event.target)) {
        setProviderOpen(false);
      }
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setProviderOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [providerOpen]);

  useEffect(() => {
    setVoiceSupported(Boolean(getSpeechRecognition()));
    return () => {
      wantListenRef.current = false;
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    autoSizeTextarea(textareaRef.current);
  }, [value]);

  async function selectProvider(next) {
    if (!next || next === aiSettings?.provider || providerSaving) return;

    const target = aiSettings?.providers?.find((p) => p.id === next);
    if (!target || target.locked) return;

    setProviderSaving(true);
    setProviderOpen(false);
    try {
      const res = await apiFetch("/api/auth/ai-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: next }),
      });
      const data = await res.json();
      if (data.success) {
        setAiSettings(data.settings);
      }
    } catch {
      // keep previous selection
    } finally {
      setProviderSaving(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled || loading) return;
    if (listening) stopListening(true);
    onSend?.(trimmed);
    setValue("");
    requestAnimationFrame(() => autoSizeTextarea(textareaRef.current));
  }

  function stopListening(aborted = false) {
    wantListenRef.current = false;
    setListening(false);
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (!recognition) return;
    try {
      if (aborted) recognition.abort?.();
      else recognition.stop?.();
    } catch {
      // ignore
    }
  }

  function startListening() {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      setVoiceError("Voice input needs Chrome or Edge.");
      return;
    }
    if (disabled || loading) return;

    // Secure contexts only (localhost / https).
    if (
      typeof window !== "undefined" &&
      !window.isSecureContext &&
      window.location.hostname !== "localhost"
    ) {
      setVoiceError("Voice input needs a secure connection (https).");
      return;
    }

    stopListening(true);
    setVoiceError("");
    baseTextRef.current = valueRef.current.trim();
    finalTextRef.current = "";
    wantListenRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      if (!wantListenRef.current) return;
      setListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let newlyFinal = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const piece = result?.[0]?.transcript || "";
        if (!piece) continue;
        if (result.isFinal) newlyFinal += piece;
        else interim += piece;
      }

      if (newlyFinal) {
        finalTextRef.current = joinParts(finalTextRef.current, newlyFinal);
      }

      setValue(joinParts(baseTextRef.current, finalTextRef.current, interim));
    };

    recognition.onerror = (event) => {
      const code = event?.error || "";
      // Benign / expected during stop or short silence.
      if (code === "aborted" || code === "no-speech") return;
      wantListenRef.current = false;
      setListening(false);
      if (code === "not-allowed" || code === "service-not-allowed") {
        setVoiceError("Microphone blocked. Allow mic access in the browser.");
      } else if (code === "network") {
        setVoiceError("Voice service unavailable. Check your network.");
      } else if (code === "audio-capture") {
        setVoiceError("No microphone found. Plug one in and try again.");
      } else {
        setVoiceError("Couldn't capture voice. Try again.");
      }
    };

    recognition.onend = () => {
      // Chrome often ends sessions early; keep going while user wants mic on.
      if (wantListenRef.current && recognitionRef.current === recognition) {
        try {
          recognition.start();
          return;
        } catch {
          // fall through and stop UI
        }
      }
      wantListenRef.current = false;
      setListening(false);
      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }
    };

    try {
      recognition.start();
      setListening(true);
    } catch {
      wantListenRef.current = false;
      setListening(false);
      setVoiceError("Couldn't start voice input. Click the mic again.");
    }
  }

  function toggleVoice() {
    if (listening || wantListenRef.current) {
      stopListening(true);
      return;
    }
    startListening();
  }

  const providers = aiSettings?.providers || [];
  const hasAnyKey = providers.some((p) => !p.locked);
  const activeProvider =
    providers.find((p) => p.id === aiSettings?.provider) || null;
  const providerLabel = aiLoading
    ? "Loading…"
    : activeProvider?.label || (hasAnyKey ? "Model" : "Add API key");
  const providerDisabled =
    aiLoading || providerSaving || disabled || loading || !hasAnyKey;
  const canSend = Boolean(value.trim()) && !disabled && !loading && hasAnyKey;

  return (
    <div className="shrink-0 border-t border-border bg-background px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {voiceError ? (
        <p className="mb-2 text-xs text-error" role="status">
          {voiceError}
        </p>
      ) : null}

      {!aiLoading && !hasAnyKey ? (
        <p className="mb-2 text-xs text-muted" role="status">
          Add a Gemini or OpenAI API key in{" "}
          <Link
            to="/settings#ai"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Settings → AI models
          </Link>{" "}
          to chat.
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "rounded-lg border border-border-strong bg-surface-elevated px-3 py-2.5 transition-colors",
          listening ? "border-primary" : "focus-within:border-primary",
        )}
      >
        <div className="flex items-end gap-2">
          <label className="sr-only" htmlFor="chat-input">
            Message
          </label>

          <textarea
            ref={textareaRef}
            id="chat-input"
            rows={1}
            value={value}
            disabled={disabled || loading || !hasAnyKey}
            onChange={(event) => {
              const next = event.target.value;
              setValue(next);
              // Keep voice base in sync if user edits while listening.
              if (listening) {
                baseTextRef.current = next;
                finalTextRef.current = "";
              }
            }}
            onInput={(event) => autoSizeTextarea(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder={
              !hasAnyKey
                ? "Add an API key in Settings to start…"
                : listening
                  ? "Listening… speak now"
                  : "Ask the assistant…"
            }
            className={cn(
              "min-h-6 max-h-[7.5rem] flex-1 resize-none overflow-hidden border-0 bg-transparent",
              "py-1.5 text-sm leading-6 text-foreground",
              "outline-none placeholder:text-muted disabled:opacity-60",
              "[scrollbar-width:thin]",
            )}
            style={{ height: INPUT_MIN_H }}
          />

          <div className="mb-0.5 flex shrink-0 items-center gap-1">
            {voiceSupported ? (
              <button
                type="button"
                disabled={disabled || loading || !hasAnyKey}
                onClick={toggleVoice}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  "disabled:opacity-50",
                  listening
                    ? "bg-primary text-on-primary"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )}
                aria-label={listening ? "Stop voice input" : "Start voice input"}
                aria-pressed={listening}
                title={listening ? "Stop listening" : "Start voice input"}
              >
                {listening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </button>
            ) : null}

            <button
              type="submit"
              disabled={!canSend}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                canSend
                  ? "bg-primary text-on-primary hover:bg-primary-hover"
                  : "bg-surface text-muted",
              )}
              aria-label="Send message"
            >
              {loading ? (
                <span
                  className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
                  aria-hidden
                />
              ) : (
                <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center border-t border-border/70 pt-2">
          <div className="relative" ref={providerMenuRef}>
            <button
              type="button"
              id="chat-ai-provider"
              disabled={providerDisabled}
              aria-haspopup="listbox"
              aria-expanded={providerOpen}
              aria-label="Choose AI model"
              onClick={() => setProviderOpen((open) => !open)}
              className={cn(
                "inline-flex h-8 max-w-[11.5rem] items-center gap-1.5 rounded-md px-2",
                "text-xs font-medium text-foreground transition",
                "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                "disabled:cursor-not-allowed disabled:opacity-60",
                providerOpen && "bg-surface",
              )}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{providerLabel}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-muted transition-transform",
                  providerOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>

            {providerOpen ? (
              <div
                role="listbox"
                aria-labelledby="chat-ai-provider"
                className={cn(
                  "absolute bottom-[calc(100%+0.35rem)] left-0 z-30 w-[13.5rem] overflow-hidden",
                  "rounded-lg border border-border bg-background py-1",
                  "shadow-[0_8px_28px_rgba(0,0,0,0.18)]",
                )}
              >
                {providers.map((provider) => {
                  const active = aiSettings?.provider === provider.id;
                  const configured = !provider.locked;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      disabled={!configured || providerSaving}
                      onClick={() => selectProvider(provider.id)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition",
                        "focus-visible:outline-none focus-visible:bg-primary-soft",
                        !configured
                          ? "cursor-not-allowed opacity-55"
                          : "hover:bg-surface",
                        active && configured && "bg-primary-soft",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                          active && configured
                            ? "bg-primary text-on-primary"
                            : "bg-surface-elevated text-primary",
                        )}
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold text-foreground">
                          {provider.label}
                        </span>
                        <span className="block text-[10px] text-muted">
                          {configured ? "Ready" : "Not configured"}
                        </span>
                      </span>
                      {active && configured ? (
                        <Check
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </form>
    </div>
  );
}
