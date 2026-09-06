# Reusable Components

## What is this?

Small UI building blocks (Button, Card, Input, …) that share Soft UI tokens so every page looks like one product.

## Why do we need it?

Without shared primitives, each page invents its own buttons and cards — inconsistent spacing, colors, and states.

## How does EmployeeAI use it?

Import from `@/components/ui`:

```jsx
import { Button, Card, StatCard, EmptyState } from "@/components/ui";
```

Dashboard currently showcases the full set (`DesignSystemShowcase`).

## How can a beginner see and try it?

Run `npm run dev`, open `/dashboard`, and interact with buttons, toggle, empty → error states.

## Where is it implemented?

- `src/components/ui/*`
- `src/components/motion/FadeIn.jsx`
- `src/utils/cn.js`

## Important things to remember

- Prefer tokens (`bg-primary`, `text-muted`) over hard-coded hex.
- Motion helpers respect `prefers-reduced-motion`.
