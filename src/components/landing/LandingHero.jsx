"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export function LandingHero() {
  return (
    <section
      id="preview"
      className="landing-hero-wash relative scroll-mt-24 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-6xl px-4 pt-14 pb-10 sm:pt-20 sm:pb-14 md:px-6 lg:pt-24 lg:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl md:text-5xl">
              EmployeeAI
            </p>
            <h1 className="mt-4 text-display text-foreground">
              Ask your workplace.
              <span className="mt-1 block text-brand-ink/80">
                Get grounded answers.
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-body sm:mt-6 sm:text-lg">
              Directory, analytics, and a streaming assistant that answers from
              your employee data — one calm workspace for modern teams.
            </p>
            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-9 sm:flex-row sm:items-center">
              <Button href="/register" size="lg" className="w-full sm:w-auto">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button
                href="/login"
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Sign in
              </Button>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.14} y={24} className="mt-12 sm:mt-14 lg:mt-16">
          <div className="landing-float mx-auto w-full max-w-4xl">
            <DashboardPreview />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
