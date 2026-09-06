# EmployeeAI — Frontend

React SPA for the EmployeeAI workplace portal: landing, auth, dashboard, employees, analytics, settings, and the AI assistant panel.

**Live:** [https://employeeai-blue.vercel.app](https://employeeai-blue.vercel.app)

Companion API: see [`../backend`](../backend) · [https://emp-backend-4wcb.onrender.com](https://emp-backend-4wcb.onrender.com)

---

## Stack

| Piece | Choice |
|-------|--------|
| Framework | React 19 + Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 |
| Motion | GSAP |
| Charts | Recharts |
| Markdown (chat) | `react-markdown` |
| Icons | Lucide |
| State | React Context (`Auth`, `Theme`, `Preferences`, `AssistantPanel`) |
| Deploy | Vercel |

---

## Folder structure

```
frontend/
├── public/
├── src/
│   ├── components/     # UI, layout, chat, dashboard, employees, …
│   ├── context/        # Auth, Theme, Preferences, Assistant panel
│   ├── hooks/          # useChat, useTheme, useLocalStorage, …
│   ├── layouts/        # App shell + auth layout
│   ├── pages/          # Route screens
│   ├── utils/          # api.js, formatters, cn, …
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js      # Dev proxy /api → localhost:3001
├── vercel.json         # Prod rewrite /api → Render backend
├── .env.example
└── package.json
```

Path alias: `@/*` → `src/*` (see `jsconfig.json` / `vite.config.js`).

---

## Prerequisites

- Node.js **18+** (20+ recommended)
- npm
- Backend running locally on port **3001** (or a deployed API URL)

---

## Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

By default leave `VITE_API_URL` empty. Vite proxies `/api` to `http://localhost:3001`.

---

## Environment variables

Only `VITE_*` keys are exposed to the browser.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Absolute backend origin (e.g. `https://emp-backend-4wcb.onrender.com`). Prefer **unset** in production so `/api` stays same-origin via `vercel.json`. |
| `VITE_EMAIL_NOTIFICATIONS` | No | Set to `true` to enable email toggles in Settings |

Example `.env` (local):

```env
VITE_EMAIL_NOTIFICATIONS=true
# VITE_API_URL=
```

API calls go through `src/utils/api.js` (`apiFetch` / `apiUrl`) with `credentials: "include"` for cookies.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (port 5173) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |

---

## Routes

| Path | Access | Screen |
|------|--------|--------|
| `/` | Public | Landing |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | Auth | Overview + KPIs |
| `/employees` | Auth | Directory CRUD |
| `/analytics` | Auth | Charts |
| `/settings` | Auth | Profile / theme / notifications |
| `/assistant` | Auth | Redirects to dashboard with assistant open |

Protected routes use `ProtectedRoute` (redirects to `/login?next=…` when signed out).

Default theme is **light** (`employeeai-theme` in `localStorage`).

---

## Talking to the API

### Local

`vite.config.js` proxies:

```text
/api/*  →  http://localhost:3001/api/*
```

### Production (Vercel)

`vercel.json` rewrites:

```text
/api/:path*  →  https://emp-backend-4wcb.onrender.com/api/:path*
/health      →  https://emp-backend-4wcb.onrender.com/health
```

SPA fallback sends other paths to `index.html`.

If you change the Render hostname, update `vercel.json` and redeploy.

---

## Features (UI)

- **Auth** — login / register / logout via `/api/auth/*`
- **Dashboard** — metrics, recent people, open assistant
- **Employees** — search, department filter, add, status change, delete
- **Analytics** — bar + pie charts (Recharts)
- **Settings** — profile sync, light/dark appearance, notification prefs
- **AI panel** — streaming chat (`useChat` + SSE), markdown replies, history in `localStorage`

---

## Deploy (Vercel)

1. Import the repo; set **Root Directory** to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Do **not** set `VITE_API_URL` unless you intentionally call Render cross-origin
5. Ensure backend `FRONTEND_URL` includes `https://employeeai-blue.vercel.app`
6. Redeploy after changing `vercel.json`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login **404** | `/api` not proxied — check Vite proxy locally or `vercel.json` on Vercel; redeploy |
| CORS / cookies fail | Prefer same-origin `/api` proxy; or set `VITE_API_URL` + backend `FRONTEND_URL` |
| API not reached locally | Start backend on port 3001 (`cd ../backend && npm run dev`) |
| Theme stuck dark | Clear `localStorage.employeeai-theme` |
| Env not applied | Vite only reads `.env` at start — restart `npm run dev`; Vercel needs rebuild for `VITE_*` |

---

## Related

- Backend README: [`../backend/README.md`](../backend/README.md)
- Monorepo overview: [`../README.md`](../README.md)
