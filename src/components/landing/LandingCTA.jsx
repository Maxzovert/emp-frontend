"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";

export function LandingCTA() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-primary px-6 py-12 text-on-primary sm:px-10 sm:py-16 md:px-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 100% 0%, rgba(255,255,255,0.22), transparent 55%), radial-gradient(ellipse 60% 50% at 0% 100%, rgba(255,255,255,0.12), transparent 50%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage:
                "radial-gradient(ellipse 70% 80% at 70% 40%, #000 10%, transparent 70%)",
            }}
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="text-caption text-on-primary/70">Ready when you are</p>
            <h2 className="mt-3 text-h1 text-on-primary">
              Open the workspace. Meet your assistant.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-on-primary/80 sm:text-base">
              Create an account, add a Gemini or OpenAI key in Settings, and
              start asking questions grounded in your directory.
            </p>
            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                href="/register"
                size="lg"
                variant="inverse"
                className="w-full sm:w-auto"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden />
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
