# Dashboard

## What is this?

The `/dashboard` home of the employee workspace — greeting, KPI cards, AI entry, and recent people.

## Why do we need it?

It summarizes the product without duplicating the full directory or analytics pages.

## How does EmployeeAI use it?

```text
WelcomeSection
  → StatCards (total / active / departments)
  → AIOverviewCard (suggested prompts → /assistant)
  → RecentEmployees (subset of demo data)
```

Data currently comes from `src/data/employees.js` until Neon (Phase 5).

## How can a beginner see and try it?

Open `/dashboard` after `npm run dev`. Click a suggested prompt or **Ask AI** in the sidebar.

## Where is it implemented?

- `src/components/dashboard/*`
- `src/app/(app)/dashboard/page.js`
- `src/data/employees.js`

## Important things to remember

Dashboard is a summary layer. Keep AI prompts linking to the same assistant flow.
