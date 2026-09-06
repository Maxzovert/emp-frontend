"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { apiFetch } from "@/utils/api";

const CHATS_KEY = "employeeai-chats-v2";
const LEGACY_KEY = "employeeai-chat-history";
const MAX_MESSAGES = 80;
const MAX_CHATS = 40;

function titleFromMessage(text) {
  const cleaned = String(text || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return "New chat";
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}…` : cleaned;
}

function createConversation(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
    ...overrides,
  };
}

function loadState() {
  if (typeof window === "undefined") {
    return { conversations: [], activeId: null };
  }

  try {
    const raw = window.localStorage.getItem(CHATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const conversations = Array.isArray(parsed?.conversations)
        ? parsed.conversations
            .filter((c) => c && typeof c.id === "string")
            .map((c) => ({
              id: c.id,
              title: c.title || "New chat",
              updatedAt: Number(c.updatedAt) || Date.now(),
              messages: Array.isArray(c.messages)
                ? c.messages
                    .filter(
                      (m) =>
                        m &&
                        (m.role === "user" || m.role === "assistant") &&
                        typeof m.content === "string",
                    )
                    .map((m) => ({
                      id: m.id || crypto.randomUUID(),
                      role: m.role,
                      content: m.content,
                    }))
                : [],
            }))
        : [];

      if (conversations.length) {
        const activeId =
          conversations.find((c) => c.id === parsed.activeId)?.id ||
          conversations[0].id;
        return { conversations, activeId };
      }
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      if (Array.isArray(legacy) && legacy.length) {
        const conversation = createConversation({
          title: titleFromMessage(
            legacy.find((m) => m.role === "user")?.content,
          ),
          messages: legacy
            .filter(
              (m) =>
                m &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string",
            )
            .map((m) => ({
              id: m.id || crypto.randomUUID(),
              role: m.role,
              content: m.content,
            })),
        });
        return { conversations: [conversation], activeId: conversation.id };
      }
    }
  } catch {
    // ignore corrupt storage
  }

  const fresh = createConversation();
  return { conversations: [fresh], activeId: fresh.id };
}

function persistState(conversations, activeId) {
  try {
    const payload = {
      activeId,
      conversations: conversations.slice(0, MAX_CHATS).map((chat) => ({
        id: chat.id,
        title: chat.title,
        updatedAt: chat.updatedAt,
        messages: chat.messages.slice(-MAX_MESSAGES).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })),
      })),
    };
    window.localStorage.setItem(CHATS_KEY, JSON.stringify(payload));
  } catch {
    // ignore quota / private mode
  }
}

async function readSseStream(response, { onToken, onDone, onError }) {
  if (!response.body) {
    throw new Error("No response body from the AI service.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      const line = part
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.startsWith("data:"));
      if (!line) continue;

      let payload;
      try {
        payload = JSON.parse(line.slice(5).trim());
      } catch {
        continue;
      }

      if (payload.type === "token" && payload.text) {
        onToken?.(payload.text);
      } else if (payload.type === "done") {
        onDone?.(payload);
      } else if (payload.type === "error") {
        onError?.(payload.error || "Unable to reach the AI service.");
      }
    }
  }
}

/** Reveal streamed text. Keep ticks aggressive so UI stays near real-time. */
function createTypewriter({ onUpdate, charsPerTick = 24, intervalMs = 8 }) {
  let target = "";
  let shown = "";
  let timer = null;
  let finished = false;
  let resolveDone = null;

  const donePromise = new Promise((resolve) => {
    resolveDone = resolve;
  });

  function paint(streaming) {
    onUpdate(shown, streaming);
  }

  function complete() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    shown = target;
    paint(false);
    resolveDone?.();
    resolveDone = null;
  }

  function tick() {
    if (shown.length >= target.length) {
      if (finished) complete();
      return;
    }

    const remaining = target.length - shown.length;
    const step = Math.min(remaining > 24 ? 48 : charsPerTick, remaining);
    shown = target.slice(0, shown.length + step);
    paint(true);
  }

  function start() {
    if (timer) return;
    timer = setInterval(tick, intervalMs);
  }

  return {
    push(piece) {
      target += piece;
      start();
    },
    finish(finalText) {
      if (typeof finalText === "string" && finalText.trim()) {
        target = finalText;
      }
      finished = true;
      if (shown.length >= target.length) {
        complete();
        return donePromise;
      }
      start();
      return donePromise;
    },
    flushNow() {
      finished = true;
      complete();
    },
    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      resolveDone?.();
      resolveDone = null;
    },
    getTarget: () => target,
    waitUntilDone: () => donePromise,
  };
}

export function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const conversationsRef = useRef([]);
  const activeIdRef = useRef(null);
  const loadingRef = useRef(false);
  const lastFailedRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    const state = loadState();
    conversationsRef.current = state.conversations;
    activeIdRef.current = state.activeId;
    setConversations(state.conversations);
    setActiveId(state.activeId);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    conversationsRef.current = conversations;
    activeIdRef.current = activeId;
    persistState(conversations, activeId);
  }, [conversations, activeId, hydrated]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId],
  );

  const messages = activeConversation?.messages || [];

  const patchActive = useCallback((updater) => {
    setConversations((prev) => {
      const id = activeIdRef.current;
      return prev.map((chat) => {
        if (chat.id !== id) return chat;
        const next = updater(chat);
        return { ...next, updatedAt: Date.now() };
      });
    });
  }, []);

  const newChat = useCallback(() => {
    if (loadingRef.current) return;
    const fresh = createConversation();
    setConversations((prev) => [fresh, ...prev].slice(0, MAX_CHATS));
    setActiveId(fresh.id);
    setError(null);
    lastFailedRef.current = null;
  }, []);

  const selectChat = useCallback((id) => {
    if (loadingRef.current) return;
    setActiveId(id);
    setError(null);
    lastFailedRef.current = null;
  }, []);

  const deleteChat = useCallback((id) => {
    if (loadingRef.current) return;
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (!next.length) {
        const fresh = createConversation();
        activeIdRef.current = fresh.id;
        setActiveId(fresh.id);
        return [fresh];
      }
      if (activeIdRef.current === id) {
        activeIdRef.current = next[0].id;
        setActiveId(next[0].id);
      }
      return next;
    });
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    if (loadingRef.current) return;
    patchActive((chat) => ({
      ...chat,
      title: "New chat",
      messages: [],
    }));
    setError(null);
    lastFailedRef.current = null;
  }, [patchActive]);

  const sendMessage = useCallback(
    async (text, { retrying = false } = {}) => {
      const trimmed = String(text ?? "").trim();
      if (!trimmed || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);
      setError(null);
      lastFailedRef.current = trimmed;

      const assistantId = crypto.randomUUID();
      let currentMessages = conversationsRef.current.find(
        (c) => c.id === activeIdRef.current,
      )?.messages;

      if (!currentMessages) {
        const fresh = createConversation();
        conversationsRef.current = [fresh];
        activeIdRef.current = fresh.id;
        setConversations([fresh]);
        setActiveId(fresh.id);
        currentMessages = [];
      }

      const withUser = retrying
        ? currentMessages
        : [
            ...currentMessages,
            { id: crypto.randomUUID(), role: "user", content: trimmed },
          ];

      const seeded = [
        ...withUser,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          streaming: true,
        },
      ];

      conversationsRef.current = conversationsRef.current.map((chat) =>
        chat.id === activeIdRef.current
          ? {
              ...chat,
              title:
                chat.title === "New chat" || !chat.messages.length
                  ? titleFromMessage(trimmed)
                  : chat.title,
              messages: seeded,
              updatedAt: Date.now(),
            }
          : chat,
      );
      setConversations(conversationsRef.current);

      const history = withUser
        .filter((item) => item.role === "user" || item.role === "assistant")
        .slice(-6)
        .map((item) => ({ role: item.role, content: item.content }));

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      let assembled = "";

      const typewriter = createTypewriter({
        onUpdate: (text, stillStreaming) => {
          setConversations((prev) =>
            prev.map((chat) => {
              if (chat.id !== activeIdRef.current) return chat;
              return {
                ...chat,
                updatedAt: Date.now(),
                messages: chat.messages.map((m) =>
                  m.id === assistantId
                    ? stillStreaming
                      ? {
                          id: assistantId,
                          role: "assistant",
                          content: text,
                          streaming: true,
                        }
                      : {
                          id: assistantId,
                          role: "assistant",
                          content: text,
                        }
                    : m,
                ),
              };
            }),
          );
        },
      });

      try {
        const res = await apiFetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history, stream: true }),
          signal: controller.signal,
        });

        if (!res.ok && !res.headers.get("content-type")?.includes("text/event-stream")) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Unable to reach the AI service.");
        }

        await readSseStream(res, {
          onToken: (piece) => {
            assembled += piece;
            typewriter.push(piece);
          },
          onDone: (payload) => {
            const finalText = String(payload?.message || assembled).trim();
            assembled = finalText;
            lastFailedRef.current = null;
          },
          onError: (message) => {
            throw new Error(message);
          },
        });

        if (!assembled.trim() && !typewriter.getTarget().trim()) {
          throw new Error("The AI returned an empty response. Please try again.");
        }

        const finalText = assembled.trim() || typewriter.getTarget().trim();
        await Promise.race([
          typewriter.finish(finalText),
          new Promise((resolve) => {
            setTimeout(() => {
              typewriter.flushNow();
              resolve();
            }, 15000);
          }),
        ]);
      } catch (err) {
        typewriter.stop();
        if (err?.name === "AbortError") return;
        setError(err.message || "Unable to reach the AI service.");
        setConversations((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeIdRef.current) return chat;
            return {
              ...chat,
              messages: chat.messages.filter(
                (m) => !(m.id === assistantId && !m.content),
              ),
            };
          }),
        );
      } finally {
        loadingRef.current = false;
        setLoading(false);
        abortRef.current = null;
      }
    },
    [],
  );

  const retry = useCallback(() => {
    if (!lastFailedRef.current) return;
    return sendMessage(lastFailedRef.current, { retrying: true });
  }, [sendMessage]);

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
      ),
    [conversations],
  );

  return {
    conversations: sortedConversations,
    activeId,
    messages,
    loading,
    error,
    hydrated,
    sendMessage,
    retry,
    clearHistory,
    newChat,
    selectChat,
    deleteChat,
  };
}
