"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  History,
  Maximize2,
  Minimize2,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { ChatHistoryPanel } from "@/components/chat/ChatHistoryPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  ASSISTANT_WIDTH,
  useAssistantPanel,
} from "@/context/AssistantPanelContext";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/utils/cn";

export function AssistantSidebar() {
  const {
    open,
    closePanel,
    expanded,
    width,
    setWidth,
    toggleExpanded,
    pendingPrompt,
    consumePendingPrompt,
  } = useAssistantPanel();
  const [showHistory, setShowHistory] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const promptHandled = useRef(null);
  const historyCloseRef = useRef(null);
  const dragRef = useRef(null);

  const {
    conversations,
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
  } = useChat();

  const activeTitle =
    conversations.find((c) => c.id === activeId)?.title || "AI Assistant";

  useEffect(() => {
    if (!hydrated || !pendingPrompt) return;
    if (promptHandled.current === pendingPrompt) return;
    promptHandled.current = pendingPrompt;
    const text = consumePendingPrompt();
    if (text) sendMessage(text);
  }, [hydrated, pendingPrompt, consumePendingPrompt, sendMessage]);

  useEffect(() => {
    if (!open) setShowHistory(false);
  }, [open]);

  useEffect(() => {
    if (!showHistory) return;
    historyCloseRef.current?.focus?.();

    function onKey(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setShowHistory(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showHistory]);

  const onResizePointerDown = useCallback(
    (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = width;
      dragRef.current = { startX, startWidth };
      setDragging(true);

      function onMove(moveEvent) {
        const state = dragRef.current;
        if (!state) return;
        const delta = state.startX - moveEvent.clientX;
        setWidth(state.startWidth + delta);
      }

      function onUp() {
        dragRef.current = null;
        setDragging(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [setWidth, width],
  );

  function handleClear() {
    setConfirmAction({ type: "clear" });
  }

  function handleDelete(id) {
    setConfirmAction({ type: "delete", id });
  }

  function closeConfirm() {
    setConfirmAction(null);
  }

  function runConfirm() {
    if (!confirmAction) return;
    if (confirmAction.type === "clear") {
      clearHistory();
    } else if (confirmAction.type === "delete" && confirmAction.id) {
      deleteChat(confirmAction.id);
    }
    setConfirmAction(null);
  }

  function closeHistory() {
    setShowHistory(false);
  }

  const confirmCopy =
    confirmAction?.type === "delete"
      ? {
          title: "Delete this chat?",
          description: "This chat and its messages will be removed permanently.",
          confirmLabel: "Delete chat",
        }
      : {
          title: "Clear messages?",
          description: "All messages in this chat will be removed.",
          confirmLabel: "Clear messages",
        };

  const desktopWidth = Math.min(
    ASSISTANT_WIDTH.max,
    Math.max(ASSISTANT_WIDTH.min, width),
  );

  return (
    <>
      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmCopy.title}
        description={confirmCopy.description}
        confirmLabel={confirmCopy.confirmLabel}
        onConfirm={runConfirm}
        onCancel={closeConfirm}
      />

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close assistant"
        onClick={closePanel}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        aria-label="AI assistant"
        aria-hidden={!open}
        style={
          open
            ? {
                // Desktop width driven by CSS var; ignored on mobile full-bleed drawer
                "--assistant-w": `${desktopWidth}px`,
              }
            : undefined
        }
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-background transition-transform duration-300 ease-out",
          "sm:max-w-md",
          "lg:static lg:z-20 lg:max-w-none lg:shrink-0 lg:transition-[width,opacity,transform] lg:duration-300",
          dragging && "lg:transition-none select-none",
          open
            ? "translate-x-0 lg:w-[var(--assistant-w)]"
            : "translate-x-full lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:border-l-0 lg:opacity-0",
        )}
      >
        <div
          className={cn(
            "relative flex h-full min-h-0 w-full flex-col",
            open ? "min-w-0 lg:min-w-[var(--assistant-w)]" : "min-w-0",
          )}
        >
          {/* Desktop resize handle */}
          {open ? (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize assistant panel"
              aria-valuemin={ASSISTANT_WIDTH.min}
              aria-valuemax={ASSISTANT_WIDTH.max}
              aria-valuenow={desktopWidth}
              tabIndex={0}
              onPointerDown={onResizePointerDown}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft") {
                  event.preventDefault();
                  setWidth(desktopWidth + 24);
                } else if (event.key === "ArrowRight") {
                  event.preventDefault();
                  setWidth(desktopWidth - 24);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  setWidth(ASSISTANT_WIDTH.default);
                } else if (event.key === "End") {
                  event.preventDefault();
                  setWidth(ASSISTANT_WIDTH.expanded);
                }
              }}
              className={cn(
                "absolute inset-y-0 left-0 z-30 hidden w-1.5 -translate-x-1/2 cursor-col-resize touch-none lg:block",
                "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent after:transition-colors",
                "hover:after:bg-primary/50 focus-visible:outline-none focus-visible:after:bg-primary",
                dragging && "after:bg-primary",
              )}
            />
          ) : null}

          <header className="flex shrink-0 items-start gap-2 border-b border-border px-3 py-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-white">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {activeTitle}
              </h2>
              <p className="text-[11px] text-muted">Workplace assistant</p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={toggleExpanded}
                className="hidden h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:inline-flex"
                aria-label={expanded ? "Shrink assistant" : "Expand assistant"}
                aria-pressed={expanded}
                title={expanded ? "Shrink panel" : "Expand panel"}
              >
                {expanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowHistory((v) => !v)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  showHistory && "bg-surface text-foreground",
                )}
                aria-label={showHistory ? "Close chat history" : "Open chat history"}
                aria-expanded={showHistory}
                aria-controls="assistant-chat-history"
                title="Previous chats"
              >
                <History className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={newChat}
                disabled={loading}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                aria-label="New chat"
                title="New chat"
              >
                <Plus className="h-4 w-4" />
              </button>
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                  aria-label="Clear current chat"
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={closePanel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label="Close assistant"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="relative flex min-h-0 flex-1 flex-col bg-surface-elevated/40">
            <div className="flex min-h-0 flex-1 flex-col px-2 pt-3">
              <ChatMessages messages={messages} loading={loading} />
            </div>

            {error ? (
              <div className="px-3 pb-2">
                <ErrorState
                  title="Couldn't reach the assistant"
                  description={error}
                  onRetry={retry}
                  className="py-6"
                />
              </div>
            ) : null}

            {!messages.length && !loading ? (
              <SuggestedPrompts onSelect={sendMessage} disabled={loading} />
            ) : null}

            <ChatInput onSend={sendMessage} disabled={loading} loading={loading} />

            {/* Previous chats — slides up from bottom */}
            <div
              className={cn(
                "absolute inset-0 z-20 flex flex-col justify-end transition-opacity duration-200",
                showHistory
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
              aria-hidden={!showHistory}
            >
              <button
                type="button"
                tabIndex={showHistory ? 0 : -1}
                aria-label="Dismiss chat history"
                onClick={closeHistory}
                className="absolute inset-0 bg-black/45"
              />

              <div
                id="assistant-chat-history"
                role="dialog"
                aria-modal="true"
                aria-label="Previous chats"
                className={cn(
                  "relative z-10 flex max-h-[70%] min-h-[14rem] flex-col rounded-t-xl border border-border border-b-0 bg-background shadow-[0_-12px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out",
                  showHistory ? "translate-y-0" : "translate-y-full",
                )}
              >
                <div className="flex shrink-0 flex-col border-b border-border">
                  <div className="flex justify-center pt-2.5" aria-hidden>
                    <span className="h-1 w-10 rounded-full bg-border" />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 pb-2.5 pt-2">
                    <p className="text-sm font-semibold text-foreground">
                      Previous chats
                    </p>
                    <button
                      ref={historyCloseRef}
                      type="button"
                      onClick={closeHistory}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      aria-label="Close previous chats"
                      title="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden px-2 pb-2 pt-1">
                  <ChatHistoryPanel
                    className="h-full border-0 bg-transparent"
                    conversations={conversations}
                    activeId={activeId}
                    hideNewChat
                    hideHeading
                    onNewChat={() => {
                      newChat();
                      closeHistory();
                    }}
                    onSelect={(id) => {
                      selectChat(id);
                      closeHistory();
                    }}
                    onDelete={handleDelete}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
