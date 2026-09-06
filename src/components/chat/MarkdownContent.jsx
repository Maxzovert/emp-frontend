"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/cn";

export function MarkdownContent({ content, className }) {
  const text = String(content || "");
  if (!text.trim()) return null;

  return (
    <div
      className={cn(
        "chat-md text-sm leading-relaxed text-foreground",
        "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className,
      )}
    >
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2.5 last:mb-0">{children}</p>,
          ul: ({ children }) => (
            <ul className="mb-2.5 list-disc space-y-1.5 pl-5 last:mb-0">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-2.5 list-decimal space-y-1.5 pl-5 last:mb-0">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="rounded bg-background px-1 py-0.5 font-mono text-[0.85em]">
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h3 className="mb-2 text-base font-bold">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 text-base font-bold">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-1.5 text-sm font-bold">{children}</h4>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
