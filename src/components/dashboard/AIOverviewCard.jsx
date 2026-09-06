"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { useAssistantPanel } from "@/context/AssistantPanelContext";

const SUGGESTED_PROMPTS = [
  "Who works in Engineering?",
  "Show me employee statistics",
  "Which departments do we have?",
  "Find a Product Manager",
];

export function AIOverviewCard({ prompts = SUGGESTED_PROMPTS }) {
  const { openPanel, openWithPrompt } = useAssistantPanel();

  return (
    <FadeIn delay={0.08}>
      <section className="rounded-lg border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Ask the workspace
              </h3>
              <p className="mt-1 max-w-lg text-sm text-muted">
                Grounded answers about people, departments, and headcount.
              </p>
            </div>
          </div>
          <Button type="button" size="sm" onClick={openPanel}>
            Open assistant
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => openWithPrompt(prompt)}
              className="group flex min-h-12 items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="line-clamp-2 font-mono text-[13px]">{prompt}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-primary" />
            </button>
          ))}
        </div>
      </section>
    </FadeIn>
  );
}
