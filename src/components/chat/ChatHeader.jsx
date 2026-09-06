"use client";

import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ChatHeader({
  onClear,
  canClear = false,
  onNewChat,
  title = "AI Assistant",
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary text-white">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-h2 truncate text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted">
            Streaming answers with saved chat history in this browser.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {onNewChat ? (
          <Button type="button" variant="secondary" size="sm" onClick={onNewChat}>
            New chat
          </Button>
        ) : null}
        {canClear ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            aria-label="Clear current chat"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
}
