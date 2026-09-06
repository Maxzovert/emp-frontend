"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { pickRandomPrompts } from "@/constants/suggestedPrompts";

export function SuggestedPrompts({
  count = 4,
  onSelect,
  disabled = false,
}) {
  const [seed, setSeed] = useState(0);
  const prompts = useMemo(() => pickRandomPrompts(count), [count, seed]);

  return (
    <div className="space-y-2 px-3 pb-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
          Try searching
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setSeed((n) => n + 1)}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
          aria-label="Shuffle suggested prompts"
        >
          <RefreshCw className="h-3 w-3" aria-hidden />
          Shuffle
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={`${seed}-${prompt}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(prompt)}
            className="min-h-9 rounded-md border border-border bg-surface px-3 py-1.5 text-left text-xs font-medium text-muted transition hover:border-border-strong hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
