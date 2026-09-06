# Framer Motion

## What is this?

Framer Motion is the animation library used for entrances and staggered lists.

## Why do we need it?

The PRD requires purposeful motion (not decorative noise) so the UI feels polished.

## How does EmployeeAI use it?

Shared helpers in `src/components/motion/FadeIn.jsx`:

- `FadeIn` — fade + slight Y
- `Stagger` / `StaggerItem` — staggered children

## How can a beginner see and try it?

Open `/dashboard` and watch StatCards stagger in. Enable OS “reduce motion” to confirm animations disable.

## Where is it implemented?

- `src/components/motion/FadeIn.jsx`
- `src/components/dashboard/DesignSystemShowcase.jsx`

## Important things to remember

Keep durations ~150–350ms. Prefer helpers over one-off animation configs.
