"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export function LandingHero() {
  return (
    <section
      id="preview"
      className="relative mx-auto grid w-full max-w-6xl scroll-mt-24 gap-10 px-4 pt-12 pb-12 sm:gap-12 sm:pt-16 sm:pb-16 md:px-6 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-20"
    >
      <div className="min-w-0">
        <FadeIn>
          <p className="mb-4 text-caption text-primary">EmployeeAI</p>
          <h1 className="text-display text-foreground">
            The workplace
            <br />
            assistant for teams
          </h1>
          <p className="mt-5 max-w-xl text-base text-body sm:mt-6 md:text-lg">
            Directory, analytics, and a grounded AI assistant on one high-contrast
            workspace - built for speed, not decoration.
          </p>
          <div className="mt-7 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button href="/register" size="lg" className="w-full sm:w-auto">
              Get started
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

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:mt-12 sm:gap-4 sm:pt-8">
            {[
              { value: "28+", label: "People" },
              { value: "6", label: "Departments" },
              { value: "1", label: "Assistant" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="text-stat text-xl sm:text-2xl md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-muted sm:text-xs md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.12} y={18}>
        <div className="min-w-0">
          <DashboardPreview />
        </div>
      </FadeIn>
    </section>
  );
}
