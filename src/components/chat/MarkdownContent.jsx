"use client";

import ReactMarkdown from "react-markdown";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

function childrenToText(children) {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }
  if (typeof children === "object" && children.props) {
    return childrenToText(children.props.children);
  }
  return "";
}

function statusTone(status) {
  const value = String(status || "").toLowerCase();
  if (value === "active") return "success";
  if (value === "away") return "warning";
  return "default";
}

/**
 * Parse AI employee bullets into structured fields.
 * Supports:
 *   **Name** – Role (Active)
 *   **Name** – Role (Active) - Department: Marketing
 *   **Name** – Role · Marketing (Active)
 */
function parseEmployeeLine(raw) {
  const text = String(raw || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return null;

  const patterns = [
    // **Name** – Role (Status) - Department: X
    /^\*{0,2}(.+?)\*{0,2}\s*[–—\-]\s*(.+?)\s*\((Active|Inactive|Away)\)\s*(?:[-–—·|,]\s*(?:Department:\s*)?(.+))?$/i,
    // **Name** – Role · Dept (Status)
    /^\*{0,2}(.+?)\*{0,2}\s*[–—\-]\s*(.+?)\s*[·|]\s*(.+?)\s*\((Active|Inactive|Away)\)$/i,
  ];

  for (let i = 0; i < patterns.length; i += 1) {
    const match = text.match(patterns[i]);
    if (!match) continue;

    if (i === 0) {
      return {
        name: match[1].trim(),
        role: match[2].trim(),
        status: match[3].trim(),
        department: match[4]?.trim() || "",
      };
    }

    return {
      name: match[1].trim(),
      role: match[2].trim(),
      department: match[3].trim(),
      status: match[4].trim(),
    };
  }

  return null;
}

function EmployeeRow({ name, role, status, department }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md border border-border bg-background px-2.5 py-2">
      <Avatar name={name} size="sm" className="h-8 w-8 shrink-0 text-[10px] ring-1" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{name}</p>
        <p className="truncate text-[11px] text-muted">
          {role}
          {department ? (
            <>
              <span className="mx-1 text-border-strong">·</span>
              {department}
            </>
          ) : null}
        </p>
      </div>
      {status ? (
        <Badge
          tone={statusTone(status)}
          dot
          className="shrink-0 rounded-md px-2 py-0.5 text-[10px] capitalize"
        >
          {status}
        </Badge>
      ) : null}
    </div>
  );
}

function ListItem({ children }) {
  const text = childrenToText(children);
  const employee = parseEmployeeLine(text);

  if (employee) {
    return (
      <li className="list-none">
        <EmployeeRow {...employee} />
      </li>
    );
  }

  return (
    <li className="leading-relaxed text-body marker:text-primary">{children}</li>
  );
}

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
          p: ({ children }) => (
            <p className="mb-2.5 text-sm leading-relaxed text-body last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => {
            const items = Array.isArray(children)
              ? children.filter(Boolean)
              : [children];
            const texts = items.map((child) =>
              parseEmployeeLine(childrenToText(child?.props?.children)),
            );
            const allEmployees =
              texts.length > 0 && texts.every((item) => item != null);

            if (allEmployees) {
              return (
                <ul className="mb-2.5 flex list-none flex-col gap-1.5 p-0 last:mb-0">
                  {children}
                </ul>
              );
            }

            return (
              <ul className="mb-2.5 list-disc space-y-1 pl-4 last:mb-0 marker:text-primary">
                {children}
              </ul>
            );
          },
          ol: ({ children }) => (
            <ol className="mb-2.5 list-decimal space-y-1 pl-4 last:mb-0 marker:text-primary">
              {children}
            </ol>
          ),
          li: ListItem,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-body">{children}</em>,
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
            <code className="rounded bg-primary-soft px-1 py-0.5 font-mono text-[0.85em] text-primary">
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h3 className="mb-2 text-base font-bold text-foreground">{children}</h3>
          ),
          h2: ({ children }) => (
            <h3 className="mb-2 text-base font-bold text-foreground">{children}</h3>
          ),
          h3: ({ children }) => (
            <h4 className="mb-1.5 text-sm font-bold text-foreground">{children}</h4>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
