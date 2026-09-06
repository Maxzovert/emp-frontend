# Next.js

## What is this?

Next.js is a React framework for building full-stack web apps. EmployeeAI uses the **App Router**: folders under `src/app` become routes, and `route.js` files become API endpoints.

## Why do we need it?

We need pages (landing, dashboard, …), a Node server for AI/DB secrets, and a single project instead of separate Vite frontend + Express backend.

## How does EmployeeAI use it?

- `src/app/page.js` → `/`
- `src/app/(app)/dashboard/page.js` → `/dashboard` (shared shell layout)
- `src/app/api/chat/route.js` → `POST /api/chat`

## How can a beginner see and try it?

```bash
npm run dev
```

Open `http://localhost:3000`, then click **Get started** to hit `/dashboard`.

## Where is it implemented?

- `src/app/`
- `next.config.mjs`
- `package.json` scripts

## Important things to remember

- Server-only secrets stay in Route Handlers / `src/services` / `src/db` — never `NEXT_PUBLIC_` for keys.
- `(app)` is a route group: it shares a layout but does not appear in the URL.
