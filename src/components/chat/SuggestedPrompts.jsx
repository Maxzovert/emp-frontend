"use client";

const DEFAULT_PROMPTS = [
  "Who works in Engineering?",
  "Show me employee statistics",
  "Which departments do we have?",
  "Find a Product Manager",
];

export function SuggestedPrompts({
  prompts = DEFAULT_PROMPTS,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="flex flex-wrap gap-2 px-3 pb-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect?.(prompt)}
          className="min-h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-left text-xs font-medium text-muted transition hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
