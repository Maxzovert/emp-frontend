"use client";

import { FadeIn } from "@/components/motion/FadeIn";
import { Button } from "@/components/ui/Button";
import { useAssistantPanel } from "@/context/AssistantPanelContext";
import { getFirstName, getGreeting } from "@/utils/greeting";

export function WelcomeSection({ name, actions }) {
  const greeting = getGreeting();
  const firstName = getFirstName(name);
  const { openPanel } = useAssistantPanel();

  return (
    <FadeIn>
      <section className="rounded-lg border border-border bg-surface px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-caption text-primary">Today</p>
            <h2 className="mt-3 text-h1 text-foreground">
              {greeting}, {firstName}
            </h2>
            <p className="mt-3 text-sm text-body md:text-base">
              People, momentum, and a fast path into the assistant.
            </p>
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={openPanel}>
                Ask AI
              </Button>
              <Button href="/employees" size="sm" variant="secondary">
                Directory
              </Button>
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
