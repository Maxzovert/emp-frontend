"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

export function LandingCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-6 md:pb-20">
      <FadeIn>
        <div className="rounded-lg bg-primary px-5 py-10 text-on-primary sm:px-8 sm:py-14 md:px-16 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-h1 text-on-primary">
              Deploy your workplace assistant
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-on-primary/80 sm:text-base">
              Jump into the dashboard for people, analytics, settings, and a
              streaming AI assistant.
            </p>
            <div className="mt-7 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
              <Button
                href="/register"
                size="lg"
                variant="inverse"
                className="w-full sm:w-auto"
              >
                Get started
              </Button>
              <Button
                href="/login"
                size="lg"
                variant="inverseOutline"
                className="w-full sm:w-auto"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
