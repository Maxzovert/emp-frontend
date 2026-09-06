# Analytics

## What is this?

The `/analytics` page turns employee records into summary cards and charts.

## Why do we need it?

Headcount and department mix are easier to understand visually than in a raw list.

## How does EmployeeAI use it?

```text
listEmployees()  (same source as directory)
  → analyticsUtils (counts / overview)
  → StatCards
  → DepartmentBarChart (Recharts)
  → DepartmentPieChart (Recharts)
  → DepartmentOverview table
```

## How can a beginner see and try it?

Open `/analytics` after `npm run dev`. Compare department bars with filters on `/employees` — totals should match the same dataset.

## Where is it implemented?

- `src/components/analytics/*`
- `src/utils/analyticsUtils.js`
- `src/app/(app)/analytics/page.js`

## Important things to remember

Never hard-code chart totals independent of employees. Colors use the Soft UI chart palette.
