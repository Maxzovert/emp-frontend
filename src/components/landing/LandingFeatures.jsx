"use client";

import {
  BarChart3,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

const features = [
  {
    title: "AI Assistant",
    body: "Ask workplace questions and get answers grounded in your employee data.",
    icon: Sparkles,
    yellow: true,
  },
  {
    title: "Employee Directory",
    body: "Search and filter teammates by name, role, department, and status.",
    icon: Users,
  },
  {
    title: "Workforce Analytics",
    body: "See department mix and active headcount with clear high-contrast charts.",
    icon: BarChart3,
  },
  {
    title: "Personalized Workspace",
    body: "Theme, profile, and notification preferences that feel like one product.",
    icon: UserRound,
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 md:py-24"
    >
      <FadeIn>
        <div className="max-w-2xl">
          <p className="text-caption text-primary">Features</p>
          <h2 className="mt-3 text-h1 text-foreground">
            Built for every modern workplace challenge
          </h2>
          <p className="mt-4 text-base text-body">
            Directory, analytics, and AI in one product - precise enough for work,
            fast enough to use all day.
          </p>
        </div>
      </FadeIn>

      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2" delay={0.05}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={feature.title}>
              <article
                className={
                  feature.yellow
                    ? "h-full rounded-lg bg-primary p-5 text-on-primary sm:p-8"
                    : "h-full rounded-lg border border-border bg-surface p-5 text-foreground sm:p-8"
                }
              >
                <span
                  className={
                    feature.yellow
                      ? "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/15 text-on-primary"
                      : "mb-5 inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary"
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3
                  className={
                    feature.yellow
                      ? "text-lg font-semibold text-on-primary"
                      : "text-lg font-semibold text-foreground"
                  }
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    feature.yellow
                      ? "mt-2 text-sm text-on-primary/80"
                      : "mt-2 text-sm text-muted"
                  }
                >
                  {feature.body}
                </p>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
