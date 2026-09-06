# Employee Directory

## What is this?

The `/employees` page where you search and filter coworkers.

## Why do we need it?

People need a fast way to find teammates by name, role, or department.

## How does EmployeeAI use it?

```text
EmployeesView
  → GET /api/employees
  → listEmployees()  (Neon, or demo fallback)
  → EmployeeSearch + DepartmentFilter (client filter)
  → EmployeeGrid → EmployeeCard
```

States: skeleton loading, empty, error + retry.

## How can a beginner see and try it?

1. `npm run dev` → open `/employees`
2. Search “Engineering” or pick a department chip
3. Optional Neon:
   - Add `DATABASE_URL` to `.env.local`
   - `npm run db:migrate`
   - `npm run db:seed`
   - Badge switches from “Demo data” to “Neon”

## Where is it implemented?

- `src/components/employees/*`
- `src/db/employees.js`, `src/db/seed.js`
- `src/app/api/employees/route.js`
- `scripts/migrate.mjs`, `scripts/seed-employees.mjs`

## Important things to remember

SQL is parameterized via Neon tagged templates. Never concatenate user input into SQL strings.
