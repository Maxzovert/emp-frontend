"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

export function LandingCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
      <FadeIn>
        <div className="rounded-lg bg-primary px-8 py-14 text-white md:px-16 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-h1 text-white">
              Deploy your workplace assistant
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
              Jump into the dashboard for people, analytics, settings, and a
              streaming AI assistant.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                href="/register"
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Get started
              </Button>
              <Button
                href="/login"
                size="lg"
                variant="secondary"
                className="border-white/25 bg-transparent text-white hover:bg-white/10"
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
