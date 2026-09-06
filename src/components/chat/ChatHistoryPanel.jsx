"use client";

import { MessageSquarePlus, Trash2 } from "lucide-react";
import { cn } from "@/utils/cn";

function formatWhen(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function ChatHistoryPanel({
  conversations = [],
  activeId,
  onNewChat,
  onSelect,
  onDelete,
  disabled = false,
  className,
  hideNewChat = false,
  hideHeading = false,
}) {
  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-full flex-col rounded-lg border border-border bg-surface",
        className,
      )}
    >
      {!hideNewChat ? (
        <div className="border-b border-border p-3">
          <button
            type="button"
            disabled={disabled}
            onClick={onNewChat}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
          >
            <MessageSquarePlus className="h-4 w-4" aria-hidden />
            New chat
          </button>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {!hideHeading ? (
          <p className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
            Previous chats
          </p>
        ) : null}

        {!conversations.length ? (
          <p className="px-2 py-3 text-xs text-muted">No chats yet.</p>
        ) : (
          <ul className="space-y-1">
            {conversations.map((chat) => {
              const active = chat.id === activeId;
              return (
                <li key={chat.id}>
                  <div
                    className={cn(
                      "group flex items-start gap-1 rounded-md border px-2 py-2 transition",
                      active
                        ? "border-primary bg-primary-soft"
                        : "border-transparent hover:border-border hover:bg-background",
                    )}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelect?.(chat.id)}
                      className="min-w-0 flex-1 rounded-lg px-1 py-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                    >
                      <span
                        className={cn(
                          "block truncate text-sm font-medium",
                          active ? "text-primary" : "text-foreground",
                        )}
                      >
                        {chat.title || "New chat"}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-muted">
                        {formatWhen(chat.updatedAt)}
                        {chat.messages?.length
                          ? ` · ${chat.messages.length} msgs`
                          : ""}
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onDelete?.(chat.id)}
                      className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted opacity-70 transition hover:bg-background hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 group-hover:opacity-100 disabled:opacity-40"
                      aria-label={`Delete ${chat.title || "chat"}`}
                      title="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
