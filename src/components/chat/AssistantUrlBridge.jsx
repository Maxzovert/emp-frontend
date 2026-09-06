"use client";

import { useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAssistantPanel } from "@/context/AssistantPanelContext";

/**
 * Opens the right-side assistant from ?assistant=1 and/or ?q=...
 * then strips those params from the URL.
 */
export function AssistantUrlBridge() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { openPanel, openWithPrompt } = useAssistantPanel();
  const handled = useRef("");

  useEffect(() => {
    const assistant = searchParams.get("assistant");
    const q = searchParams.get("q");
    if (!assistant && !q) return;

    const key = `${assistant || ""}|${q || ""}`;
    if (handled.current === key) return;
    handled.current = key;

    if (q?.trim()) {
      openWithPrompt(q.trim());
    } else {
      openPanel();
    }

    const next = new URLSearchParams(searchParams.toString());
    next.delete("assistant");
    next.delete("q");
    const qs = next.toString();
    navigate(qs ? `${pathname}?${qs}` : pathname, { replace: true });
  }, [searchParams, pathname, navigate, openPanel, openWithPrompt]);

  return null;
}
