"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export function ChatMessages({ messages, loading }) {
  const listRef = useRef(null);
  const last = messages[messages.length - 1];
  const showTyping =
    loading && (!last || last.role !== "assistant" || !last.streaming);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Keep scroll inside the chat pane — never scroll the page.
    list.scrollTop = list.scrollHeight;
  }, [messages, loading, last?.content]);

  if (!messages.length && !loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-10 text-center">
        <p className="max-w-sm text-sm text-muted">
          Start a conversation or pick a suggested prompt below.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1 py-2"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {showTyping ? <TypingIndicator /> : null}
      </div>
    </div>
  );
}
