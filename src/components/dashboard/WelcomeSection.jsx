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
      <section className="rounded-lg border border-border bg-surface px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl min-w-0">
            <p className="text-caption text-primary">Today</p>
            <h2 className="mt-2 text-h1 text-foreground sm:mt-3">
              {greeting}, {firstName}
            </h2>
            <p className="mt-2 text-sm text-body sm:mt-3 md:text-base">
              People, momentum, and a fast path into the assistant.
            </p>
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : (
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <Button
                type="button"
                size="sm"
                className="flex-1 sm:flex-none"
                onClick={openPanel}
              >
                Ask AI
              </Button>
              <Button
                href="/employees"
                size="sm"
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                Directory
              </Button>
            </div>
          )}
        </div>
      </section>
    </FadeIn>
  );
}
