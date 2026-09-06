"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, Mic, MicOff } from "lucide-react";
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
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);
  const valueRef = useRef("");
  const baseTextRef = useRef("");
  const finalTextRef = useRef("");
  const wantListenRef = useRef(false);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

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

  const canSend = Boolean(value.trim()) && !disabled && !loading;

  return (
    <div className="shrink-0 border-t border-border bg-background px-3 py-3">
      {voiceError ? (
        <p className="mb-2 text-xs text-error" role="status">
          {voiceError}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-end gap-2 rounded-lg border border-border-strong bg-surface-elevated px-3 py-2.5 transition-colors",
          listening
            ? "border-primary"
            : "focus-within:border-primary",
        )}
      >
        <label className="sr-only" htmlFor="chat-input">
          Message
        </label>

        <textarea
          ref={textareaRef}
          id="chat-input"
          rows={1}
          value={value}
          disabled={disabled || loading}
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
          placeholder={listening ? "Listening… speak now" : "Ask the assistant…"}
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
              disabled={disabled || loading}
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
      </form>
    </div>
  );
}

