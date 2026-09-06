"use client";

import {
  BarChart3,
  MessageSquareText,
  Settings2,
  Users,
} from "lucide-react";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";

const features = [
  {
    title: "Grounded AI assistant",
    body: "Ask who works where, who is active, or how the workforce looks — replies stream from live employee data.",
    icon: MessageSquareText,
    accent: true,
  },
  {
    title: "Searchable directory",
    body: "Find teammates by name, role, department, and status without digging through spreadsheets.",
    icon: Users,
  },
  {
    title: "Workforce analytics",
    body: "Department mix and headcount at a glance, so leaders see structure instead of raw tables.",
    icon: BarChart3,
  },
  {
    title: "Your workspace, your rules",
    body: "Theme, profile, notifications, and bring-your-own Gemini or OpenAI keys in Settings.",
    icon: Settings2,
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-24"
    >
      <FadeIn>
        <div className="max-w-2xl">
          <p className="text-caption text-primary">What you get</p>
          <h2 className="mt-3 text-h1 text-foreground">
            Everything a workplace assistant should do — without the noise
          </h2>
          <p className="mt-4 text-base text-body">
            Four focused capabilities. One product feel. Built for speed and
            clarity, not ornament.
          </p>
        </div>
      </FadeIn>

      <Stagger className="mt-12 grid gap-0 border-t border-border sm:grid-cols-2" delay={0.06}>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <StaggerItem key={feature.title}>
              <article
                className={
                  feature.accent
                    ? "group relative h-full border-b border-border bg-primary p-6 text-on-primary sm:border-r sm:p-8"
                    : `group relative h-full border-b border-border p-6 sm:p-8 ${
                        index % 2 === 0 ? "sm:border-r" : ""
                      }`
                }
              >
                <span
                  className={
                    feature.accent
                      ? "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-on-primary"
                      : "mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary"
                  }
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3
                  className={
                    feature.accent
                      ? "font-display text-lg font-semibold tracking-tight text-on-primary"
                      : "font-display text-lg font-semibold tracking-tight text-foreground"
                  }
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    feature.accent
                      ? "mt-2 max-w-sm text-sm leading-relaxed text-on-primary/80"
                      : "mt-2 max-w-sm text-sm leading-relaxed text-muted"
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
