# Recharts

## What is this?

Recharts is a React charting library built on SVG.

## Why do we need it?

The PRD requires a bar chart and a pie chart for workforce analytics.

## How does EmployeeAI use it?

- `DepartmentBarChart` — headcount by department
- `DepartmentPieChart` — department mix (donut-style)

Both read data from `getDepartmentCounts(employees)`.

## How can a beginner see and try it?

Open `/analytics` and hover a bar or pie slice to see the tooltip.

## Where is it implemented?

- `src/components/analytics/DepartmentBarChart.jsx`
- `src/components/analytics/DepartmentPieChart.jsx`

## Important things to remember

Chart components are client components. Keep data preparation in utils, not inside Recharts markup.
