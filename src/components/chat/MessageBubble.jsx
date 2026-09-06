"use client";

import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { cn } from "@/utils/cn";

function StreamingCaret() {
  return (
    <span
      className="chat-caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.12em] bg-primary align-baseline"
      aria-hidden
    />
  );
}

function TypingPulse() {
  return (
    <div className="flex min-h-6 items-center gap-2.5 py-0.5" aria-live="polite">
      <span className="inline-flex items-center gap-1.5" aria-hidden>
        <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
        <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="text-xs font-medium text-muted">Typing…</span>
    </div>
  );
}

export function MessageBubble({ message }) {
  const isUser = message.role === "user";
  const streaming = Boolean(message.streaming);
  const content = String(message.content || "");
  const waiting = streaming && !content.trim();

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[90%] rounded-lg px-3.5 py-3 text-sm leading-relaxed md:max-w-[80%]",
          isUser
            ? "rounded-br-md bg-primary text-white"
            : "rounded-bl-md border border-border bg-surface text-foreground",
        )}
      >
        <span className="sr-only">{isUser ? "You: " : "Assistant: "}</span>

        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : waiting ? (
          <TypingPulse />
        ) : (
          <div>
            <MarkdownContent content={content} />
            {streaming ? (
              <p className="mt-1 mb-0">
                <StreamingCaret />
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
