"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AssistantPanelContext = createContext(null);

const OPEN_KEY = "employeeai-assistant-open";
const EXPANDED_KEY = "employeeai-assistant-expanded";
const WIDTH_KEY = "employeeai-assistant-width";

export const ASSISTANT_WIDTH = {
  default: 384,
  expanded: 560,
  min: 320,
  max: 720,
};

function readOpenDefault() {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(OPEN_KEY);
    if (raw != null) return raw === "1" || raw === "true";
    // Desktop: open by default; mobile: closed (drawer)
    return window.matchMedia("(min-width: 1024px)").matches;
  } catch {
    return false;
  }
}

function clampWidth(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return ASSISTANT_WIDTH.default;
  return Math.min(ASSISTANT_WIDTH.max, Math.max(ASSISTANT_WIDTH.min, Math.round(n)));
}

function readExpandedDefault() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(EXPANDED_KEY) === "1";
  } catch {
    return false;
  }
}

function readWidthDefault() {
  if (typeof window === "undefined") return ASSISTANT_WIDTH.default;
  try {
    const raw = window.localStorage.getItem(WIDTH_KEY);
    if (raw != null) return clampWidth(raw);
    return readExpandedDefault()
      ? ASSISTANT_WIDTH.expanded
      : ASSISTANT_WIDTH.default;
  } catch {
    return ASSISTANT_WIDTH.default;
  }
}

export function AssistantPanelProvider({ children }) {
  const [open, setOpenState] = useState(false);
  const [expanded, setExpandedState] = useState(false);
  const [width, setWidthState] = useState(ASSISTANT_WIDTH.default);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOpenState(readOpenDefault());
    setExpandedState(readExpandedDefault());
    setWidthState(readWidthDefault());
    setReady(true);
  }, []);

  const setOpen = useCallback((next) => {
    setOpenState((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      try {
        window.localStorage.setItem(OPEN_KEY, value ? "1" : "0");
      } catch {
        // ignore
      }
      return Boolean(value);
    });
  }, []);

  const setWidth = useCallback((next) => {
    setWidthState((prev) => {
      const value = clampWidth(typeof next === "function" ? next(prev) : next);
      const isExpanded = value >= ASSISTANT_WIDTH.expanded - 24;
      try {
        window.localStorage.setItem(WIDTH_KEY, String(value));
        window.localStorage.setItem(EXPANDED_KEY, isExpanded ? "1" : "0");
      } catch {
        // ignore
      }
      setExpandedState(isExpanded);
      return value;
    });
  }, []);

  const setExpanded = useCallback(
    (next) => {
      setExpandedState((prev) => {
        const value = typeof next === "function" ? next(prev) : next;
        const nextWidth = value
          ? ASSISTANT_WIDTH.expanded
          : ASSISTANT_WIDTH.default;
        try {
          window.localStorage.setItem(EXPANDED_KEY, value ? "1" : "0");
          window.localStorage.setItem(WIDTH_KEY, String(nextWidth));
        } catch {
          // ignore
        }
        setWidthState(nextWidth);
        return Boolean(value);
      });
    },
    [],
  );

  const openPanel = useCallback(() => setOpen(true), [setOpen]);
  const closePanel = useCallback(() => setOpen(false), [setOpen]);
  const togglePanel = useCallback(() => setOpen((v) => !v), [setOpen]);
  const toggleExpanded = useCallback(
    () => setExpanded((v) => !v),
    [setExpanded],
  );

  const openWithPrompt = useCallback(
    (prompt) => {
      const text = String(prompt || "").trim();
      setOpen(true);
      if (text) setPendingPrompt(text);
    },
    [setOpen],
  );

  const consumePendingPrompt = useCallback(() => {
    const value = pendingPrompt;
    setPendingPrompt(null);
    return value;
  }, [pendingPrompt]);

  const value = useMemo(
    () => ({
      open,
      ready,
      expanded,
      width,
      pendingPrompt,
      setOpen,
      setExpanded,
      setWidth,
      openPanel,
      closePanel,
      togglePanel,
      toggleExpanded,
      openWithPrompt,
      consumePendingPrompt,
    }),
    [
      open,
      ready,
      expanded,
      width,
      pendingPrompt,
      setOpen,
      setExpanded,
      setWidth,
      openPanel,
      closePanel,
      togglePanel,
      toggleExpanded,
      openWithPrompt,
      consumePendingPrompt,
    ],
  );

  return (
    <AssistantPanelContext.Provider value={value}>
      {children}
    </AssistantPanelContext.Provider>
  );
}

export function useAssistantPanel() {
  const ctx = useContext(AssistantPanelContext);
  if (!ctx) {
    throw new Error("useAssistantPanel must be used within AssistantPanelProvider");
  }
  return ctx;
}
