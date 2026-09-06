# Neon Postgres

## What is this?

Neon is hosted PostgreSQL. EmployeeAI stores employee rows there.

## Why do we need it?

A real database keeps directory + analytics consistent and prepares a server-side AI context later.

## How does EmployeeAI use it?

- `DATABASE_URL` (server-only) → `src/db/client.js`
- Queries in `src/db/employees.js` (parameterized)
- Migrate/seed scripts populate ~25 demo employees

If `DATABASE_URL` is missing, the app falls back to `src/data/employees.js` so demos still work.

## How can a beginner see and try it?

```bash
cp .env.example .env.local
# paste Neon connection string
npm run db:migrate
npm run db:seed
npm run dev
```

Open `/employees` — badge should say **Neon**.

## Where is it implemented?

- `src/db/*`
- `scripts/migrate.mjs`
- `scripts/seed-employees.mjs`
- `.env.example`

## Important things to remember

Never commit `.env.local`. Never put `DATABASE_URL` in `NEXT_PUBLIC_*`.
