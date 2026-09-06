"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-2 rounded-lg rounded-bl-md border border-border bg-surface-elevated px-4 py-3">
        <span className="inline-flex items-center gap-1" aria-hidden>
          <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
          <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
          <span className="chat-typing-dot h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs font-medium text-muted">Assistant is typing</span>
      </div>
    </div>
  );
}
