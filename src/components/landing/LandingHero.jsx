"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/motion/FadeIn";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

export function LandingHero() {
  return (
    <section
      id="preview"
      className="relative mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 pt-16 pb-16 md:px-6 md:pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pb-20"
    >
      <div>
        <FadeIn>
          <p className="mb-4 text-caption text-primary">EmployeeAI</p>
          <h1 className="text-display text-foreground">
            The workplace
            <br />
            assistant for teams
          </h1>
          <p className="mt-6 max-w-xl text-base text-body md:text-lg">
            Directory, analytics, and a grounded AI assistant on one high-contrast
            workspace - built for speed, not decoration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/register" size="lg">
              Get started
            </Button>
            <Button href="/login" size="lg" variant="secondary">
              Sign in
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {[
              { value: "28+", label: "People" },
              { value: "6", label: "Departments" },
              { value: "1", label: "Assistant" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-stat text-2xl md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-xs text-muted md:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.12} y={18}>
        <DashboardPreview />
      </FadeIn>
    </section>
  );
}
