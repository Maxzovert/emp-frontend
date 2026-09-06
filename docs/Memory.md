# EmployeeAI — Project Memory

## Purpose

Living project memory for humans and AI coding agents.

**Read this file first** before exploring the codebase. It holds locked decisions, current phase, and enough context to continue work without re-reading every doc or the full repo.

Do not use Memory as a replacement for Architecture, Rules, Design, or Security — those remain source of truth for their domains. Memory summarizes and records *changes*.

---

# Agent Quick Context (read this first)

## What we are building

**EmployeeAI** — AI-powered internal employee workspace (modern SaaS feel, not a dense HR admin panel).

Routes:

| Route | Purpose |
|---|---|
| `/` | Public landing |
| `/login` · `/register` | Auth |
| `/dashboard` | Workspace overview (auth required) |
| `/assistant` | AI chat (auth required) |
| `/employees` | Directory (auth required) |
| `/analytics` | Workforce charts (auth required) |
| `/settings` | Profile, theme, notifications (auth required) |

## Locked stack (do not change unless recorded here)

| Layer | Choice |
|---|---|
| Framework | **Next.js** (App Router) |
| Language | **JavaScript** (`.js` / `.jsx`) — no TypeScript unless requirements change |
| Runtime | **Node.js** |
| Database | **PostgreSQL via Neon** |
| Styling | **Tailwind CSS** + design tokens |
| Charts | **Recharts** |
| Animation | **Framer Motion** |
| Icons | **Lucide React** |
| State | Context (global prefs/theme) + hooks (`useChat`) + local state |
| Persistence | Neon for employees + users; JWT cookie session; `localStorage` for theme/prefs/chat history |
| AI | **LangChain** + default **Gemini** (server-only). Swap models via `src/services/ai/model.js` |
| Auth | Email/password (bcrypt) + JWT HTTP-only cookie (`AUTH_SECRET`) |

## AI module layout (locked)

```text
src/services/ai/
  aiService.js   → public sendMessage()
  model.js       → LangChain getChatModel() (Gemini now)
  prompts.js     → system + templates
  context.js     → safe Neon employee context

src/hooks/useChat.js
src/components/chat/
app/api/chat/route.js → aiService only
```

Full diagrams: `docs/AI-Architecture.md`.

## Locked design theme (ClickHouse + navy)

| Token | Value / direction |
|---|---|
| Primary | Navy `#2B5797` (dark) / `#0B2545` (light) - CTAs, accents, bands |
| On-primary | `#FFFFFF` white on navy |
| Canvas | Near-pure black `#0A0A0A` (dark default) |
| Surfaces | `#1A1A1A` cards, `#242424` elevated - hairline borders, **no shadows** |
| Typography | Inter (display + UI) + JetBrains Mono (code) |
| Radius | 8px buttons/inputs, 12px cards; pills only on badges |
| Charts | Navy, emerald, soft blue, amber, rose |

Layout/rhythm still follows `DESIGN-clickhouse.md`; brand voltage is **navy** instead of electric yellow.

Light mode is a secondary paper + navy accent variant; dark is the brand default.

## Data & charts

- Employees live in **Neon Postgres** (seed ~20–30 rows).
- Users live in Neon `users` table (auth). Demo: `john.carter@employeeai.app` / `password123`.
- Analytics **derive** from the same employee dataset (bar + pie required; optional area chart if useful).
- Display patterns: dashboard ink hero + metric strip + list rows; employees as searchable directory list (not card grid); settings as profile hero + section nav; Recharts on analytics.
- Workspace routes require a valid session cookie (see `Security.md`).

## Security baseline

- Never commit `.env` or secrets.
- AI keys and Neon URL: **server-only** env vars.
- Parameterized SQL only; validate inputs; sanitize AI context.
- Full rules: `docs/Security.md`.

## Current phase

**Auth (login / logout / profile)** — complete

Product remains submission-ready; workspace routes are session-protected.


## Docs map

| File | Use when |
|---|---|
| `PRD.md` | What to build / acceptance |
| `Architecture.md` | Structure, folders, data flow |
| `Rules.md` | Coding conventions |
| `Design.md` | UI/UX + color tokens |
| `Flow.md` | User/feature flows |
| `Phases.md` | What to implement next |
| `Security.md` | Secrets, API, DB, AI safety |
| `Documentation.md` | How to write `Notes/` |
| `AI-Architecture.md` | LangChain modules, flows, diagrams |
| `Workflow.md` | Complete how-it-works + how to operate |
| `Memory.md` | Decisions + agent context (this file) |

---

# How to Record a Change

Append under **Change Log** using:

```markdown
## [YYYY-MM-DD] — Change Title

### Change
What changed?

### Reason
Why?

### Files affected
- `path`

### Impact
What this affects going forward.

### Follow-up
What still needs doing.
```

**Rule for AI agents:** After any meaningful stack, design, security, or architecture decision, update this file in the same session. Do not wait to be asked.

---

# Initial Project Decisions

## 2026-09-04 — Initial architecture (Vite era)

### Change

Defined EmployeeAI as a responsive AI-powered employee workspace originally planned with React + Vite.

### Reason

Assignment required modern React app with routing, state, AI, analytics, directory, settings, responsive UI, animations.

### Decisions (superseded where noted below)

- JavaScript instead of TypeScript.
- Tailwind, Framer Motion, Recharts, Lucide.
- Context/hooks; localStorage for client prefs.
- Dedicated AI service layer.

### Impact

Baseline product shape remains valid; tooling updated in next entry.

---

# Change Log

## 2026-09-04 — Auth: login, logout, profile

### Change

- Added Neon `users` table, bcrypt password hashing, JWT HTTP-only session cookie.
- Routes: `/login`, `/register`; APIs under `/api/auth/*`; middleware protects workspace pages.
- Header logout + Settings profile save to DB when signed in.
- Env: `AUTH_SECRET`. Seed: `npm run db:seed-users`.

### Reason

User requested profile login/logout and auth for the workspace.

### Files affected

- `src/lib/auth/*`, `src/db/users.js`, `src/services/authService.js`
- `src/app/api/auth/*`, `src/middleware.js`, `src/context/AuthContext.js`
- `src/app/(auth)/*`, `src/components/auth/*`, Header, ProfileForm
- `scripts/seed-users.mjs`, `.env.example`, `Notes/Authentication.md`

### Impact

Unauthenticated visits to workspace routes redirect to `/login`. Auth requires `DATABASE_URL`.

### Follow-up

Optional: rate limiting, password reset, SSO.

---

## 2026-09-04 — Stack upgrade: Next.js + Neon + BoostAI theme

### Change

- Replaced **React + Vite** with **Next.js (App Router) + Node.js**.
- Replaced pure client mock JS files as primary data store with **PostgreSQL (Neon)**; seed data still allowed for demo.
- Locked visual theme to **BoostAI-style Soft UI** (orange primary `#FF4D17`, mint/peach accents, rounded cards, soft glow).
- Added `docs/Security.md`.
- Updated Architecture, PRD, Rules, Design, Phases, Flow, Documentation, README to match.

### Reason

User chose Next.js, Node.js, Neon Postgres, and the provided AI SaaS mock as the design reference. Docs must stay aligned so agents do not re-ask or rebuild the wrong stack.

### Files affected

- `docs/Memory.md`
- `docs/Security.md` (new)
- `docs/Architecture.md`
- `docs/PRD.md`
- `docs/Rules.md`
- `docs/Design.md`
- `docs/Phases.md`
- `docs/Flow.md`
- `docs/Documentation.md`
- `README.md`

### Impact

All implementation must use Next.js + Neon + the locked color tokens. Phase 1 initializes Next.js, not Vite. AI keys never go in client bundles.

### Follow-up

- User confirms start → Phase 1 foundation.
- Add Neon connection string via `.env.local` (never commit).
- Phase 7: LangChain + Gemini (provider already locked).

## 2026-09-04 — LangChain AI layer + Gemini default

### Change

- Adopted **LangChain** so providers are swappable behind one interface.
- Default model provider: **Google Gemini**.
- Locked AI folder structure under `src/services/ai/` (`aiService`, `model`, `prompts`, `context`) plus `useChat` and `components/chat`.
- Added `docs/AI-Architecture.md` with responsibility diagrams for each module.

### Reason

User requested model-agnostic structure via LangChain, Gemini for now, and clear diagrams of each AI concept/file.

### Files affected

- `docs/AI-Architecture.md` (new)
- `docs/Architecture.md`
- `docs/Memory.md`
- `docs/Rules.md`
- `docs/Security.md`
- `docs/Phases.md`
- `docs/Flow.md`
- `docs/PRD.md`
- `docs/Documentation.md`
- `README.md`

### Impact

Chat UI/hooks must not import provider SDKs. Provider swaps happen in `model.js` + env only.

### Follow-up

None until Phase 7 implementation.

## 2026-09-04 — Phase 1 foundation complete

### Change

- Scaffolded Next.js 15 App Router (JavaScript) under `src/app`.
- Tailwind v4 + Soft UI CSS tokens (`#FF4D17`), light/dark via `ThemeProvider`.
- App shell: Sidebar, Header, MobileNavigation; landing page at `/`.
- Placeholder routes: `/dashboard`, `/assistant`, `/employees`, `/analytics`, `/settings`.
- Neon client scaffold (`src/db`), AI module stubs (`src/services/ai`), `POST /api/chat`.
- Installed framer-motion, recharts, lucide-react, `@neondatabase/serverless`.
- Added `.env.example`, Notes for Next.js + Tailwind.

### Reason

User started Phase 1.

### Files affected

- `package.json`, `src/app/**`, `src/components/**`, `src/services/ai/**`, `src/db/**`, `src/hooks/**`, `src/context/**`, `.env.example`, `Notes/Next.js.md`, `Notes/Tailwind-CSS.md`, `README.md`

### Impact

App boots with navigation and design tokens. Neon URL and Gemini keys still optional until Phases 5/7.

### Follow-up

Phase 2 design system components.

## 2026-09-04 — Phase 2 design system complete

### Change

- Added UI primitives: Button, Card, Input, Badge, Avatar, Toggle, Skeleton, EmptyState, ErrorState, PageHeader, StatCard.
- Typography scale + spacing CSS variables; reduced-motion CSS.
- Motion helpers: FadeIn, Stagger, StaggerItem (Framer Motion).
- Dashboard hosts `DesignSystemShowcase`; other pages use PageHeader + Card via PagePlaceholder.
- Notes: Reusable-Components, Framer-Motion.

### Reason

Phase 2 implementation request.

### Files affected

- `src/components/ui/*`
- `src/components/motion/FadeIn.jsx`
- `src/components/dashboard/DesignSystemShowcase.jsx`
- `src/app/globals.css`
- `src/utils/cn.js`
- `Notes/Reusable-Components.md`, `Notes/Framer-Motion.md`

### Impact

Later phases compose these primitives instead of inventing new styles.

### Follow-up

Phase 3 polished landing page.

## 2026-09-04 — Phase 3 landing page complete

### Change

- Polished landing: sticky navbar (mobile menu + theme), hero with Soft UI CTAs, floating dashboard preview motion, staggered features (4), CTA band, footer.
- Components under `src/components/landing/*`.
- Note: `Notes/Landing-Page.md`.

### Reason

Phase 3 implementation request.

### Files affected

- `src/app/page.js`
- `src/components/landing/*`
- `src/components/layout/LandingNavbar.jsx`
- `Notes/Landing-Page.md`
- `docs/Memory.md`
- `README.md`

### Impact

Public entry experience matches Soft UI / BoostAI-inspired direction.

### Follow-up

Phase 4 real dashboard (greeting, stats, AI card, recent employees).

## 2026-09-04 — Phase 4 shell & dashboard complete

### Change

- Polished app shell: sidebar Ask AI CTA, header search/profile/theme, soft glow.
- Real dashboard: greeting, StatCards, AI overview + suggested prompts, recent employees.
- Demo dataset `src/data/employees.js` (25 people) until Neon Phase 5.
- Removed design-system showcase from dashboard (primitives remain in `components/ui`).

### Reason

Phase 4 implementation request.

### Files affected

- `src/components/dashboard/*`
- `src/components/layout/*`
- `src/app/(app)/layout.js`, `dashboard/page.js`
- `src/data/employees.js`
- `Notes/Dashboard.md`

### Impact

`/dashboard` is the product home. Directory/analytics still placeholders until later phases.

### Follow-up

Phase 5 employee directory + Neon.

## 2026-09-04 — Phase 5 employee directory complete

### Change

- Neon schema + migrate/seed scripts (`npm run db:migrate`, `npm run db:seed`).
- Data access `listEmployees` with parameterized SQL; demo fallback if no `DATABASE_URL`.
- `GET /api/employees`.
- Employees UI: search, department chips, grid cards, skeleton/empty/error.
- Dashboard loads employees via the same data layer.

### Reason

Phase 5 implementation request.

### Files affected

- `src/db/*`, `src/components/employees/*`, `src/app/api/employees/route.js`
- `src/app/(app)/employees/page.js`, `dashboard/page.js`
- `scripts/migrate.mjs`, `scripts/seed-employees.mjs`
- `Notes/Employee-Directory.md`, `Notes/Neon-Postgres.md`

### Impact

Directory is usable offline via demo data; Neon when configured.

### Follow-up

Phase 6 analytics charts from the same employee dataset. User should add Neon URL + seed for full DoD.

## 2026-09-04 — Phase 6 analytics complete

### Change

- Analytics page: StatCards, Recharts bar + pie, department overview table.
- Shared `analyticsUtils` (counts, status, overview, Soft UI chart colors).
- Data from `listEmployees()` (Neon or demo) — same source as directory/dashboard.

### Reason

Phase 6 implementation request.

### Files affected

- `src/components/analytics/*`
- `src/utils/analyticsUtils.js`
- `src/app/(app)/analytics/page.js`
- `Notes/Analytics.md`, `Notes/Recharts.md`

### Impact

Workforce visuals stay consistent with employee records.

### Follow-up

Phase 7 LangChain + Gemini assistant.

## 2026-09-04 — Phase 7 AI assistant complete

### Change

- Wired LangChain: `model.js` (Gemini default, OpenAI optional), `prompts.js`, `context.js`, `aiService.js`.
- Chat UI: header, messages, bubbles, input, typing, suggested prompts, error retry.
- `useChat` sends history to `POST /api/chat`; supports `?q=` bootstrap from dashboard.
- Packages: `@langchain/core`, `@langchain/google-genai`, `@langchain/openai`.

### Reason

Phase 7 implementation request.

### Files affected

- `src/services/ai/*`
- `src/components/chat/*`
- `src/hooks/useChat.js`
- `src/app/api/chat/route.js`
- `src/app/(app)/assistant/page.js`
- `Notes/LangChain.md`, `Notes/AI-Service-Layer.md`

### Impact

Real Gemini replies via server-only keys. Swap provider in `model.js` + env without UI changes.

### Follow-up

Phase 8 settings persistence. Ensure `GOOGLE_API_KEY` is set in `.env` / `.env.local`.

## 2026-09-04 — Phase 8 settings & persistence complete

### Change

- Settings page: ProfileForm, AppearanceSettings, NotificationSettings.
- `PreferencesProvider` persists profile + notifications in localStorage.
- Header avatar/name and dashboard greeting read persisted profile.
- Theme already persisted; appearance UI now chooses light/dark explicitly.

### Reason

Phase 8 implementation request.

### Files affected

- `src/components/settings/*`
- `src/context/PreferencesContext.js`
- `src/app/layout.js`, `settings/page.js`, `dashboard/page.js`
- `src/components/layout/Header.jsx`, `dashboard/DashboardView.jsx`
- `Notes/Settings.md`, `Notes/LocalStorage.md`

### Impact

Preferences survive refresh in the browser.

### Follow-up

Optional Phase 9 bonuses, or Phase 10 UX pass.

## 2026-09-04 — Phase 9 bonus features complete

### Change

1. Dark mode polish — layered dark tokens, theme color transitions, elevated surfaces.
2. Local chat history — `employeeai-chat-history` + Clear button.
3. Typing animation — message entrance motion + improved typing indicator.
4. Voice input — Web Speech API mic on chat input.
5. AI context — role aliases, workforce summary, smarter ranking.

### Reason

Phase 9 implementation request.

### Files affected

- `src/app/globals.css`
- `src/hooks/useChat.js`
- `src/services/ai/context.js`
- `src/components/chat/*`
- `Notes/Voice-Input.md`, `Notes/Dark-Mode.md`

### Impact

Bonuses layered on Phase 7/8 without changing the core AI boundary.

### Follow-up

Phase 10 UX state pass / Phase 11 responsive & a11y / Phase 12 final polish.

## 2026-09-04 — Phases 10–12 complete (submission ready)

### Change

- UX: real header search link, notifications → settings, honest KPIs, empty states, chat loading spinner, clear-history confirm, route `error.js` + `loading.js`.
- A11y/responsive: skip links, focus-visible rings, larger touch targets, mobile chat layout, aria-live chat log, aria-pressed filters/theme.
- Copy: landing/CTA/AI card reflect shipped features; `#preview` anchors hero.
- Cleanup: removed `PagePlaceholder`, unused `LANDING_NAV`.
- Docs: README submission guide; Notes for Error-Handling, Security-Basics, Custom-Hooks; Memory marked complete.

### Reason

User asked to finish the project (Phases 10–12).

### Files affected

- Layout/header/nav/chat/dashboard/analytics/settings UI
- `src/app/(app)/error.js`, `loading.js`
- `README.md`, `docs/Memory.md`, `Notes/*`

### Impact

App is polished for evaluation without changing the locked stack.

### Follow-up

None required for assignment scope. Optional: wire real Neon + Gemini keys for live demo.

### Change

Agents must keep `Memory.md`, `Security.md`, and related docs updated when decisions change, without waiting for the user to re-request doc updates.

### Reason

Avoid repeated clarification and full-repo rereads.

### Impact

Doc drift is a bug. Fix docs in the same change set as architecture decisions.

### Follow-up

None.

---

## 2026-09-06 — ClickHouse design system lock

### Change

Replaced Signal (cobalt) with ClickHouse-inspired tokens from `DESIGN-clickhouse.md`: near-black canvas, `#FAFF69` yellow CTAs/stats, Inter + JetBrains Mono, 8/12px radii, no shadows. Dark is the default theme. Landing uses yellow feature/CTA bands; dashboard metrics use yellow stat callouts.

### Reason

User requested implementing `DESIGN-clickhouse.md`.

### Impact

Theme, fonts, buttons, cards, landing, dashboard, employees, settings, and shell updated. Light mode remains available as a secondary variant.

### Follow-up

Optional: further chat/analytics chrome polish to match code-window card density.

---

## 2026-09-06 — Workspace pages UI redesign

### Change

Redesigned `/dashboard`, `/employees`, and `/settings` away from stacked Soft UI cards toward Signal compositions: ink welcome band + metric strip + people list; directory toolbar + row list; settings profile hero with side section nav.

### Reason

User disliked the overall card-heavy UI and asked for a new look on those three pages.

### Impact

Behavior (fetch/add/delete employees, profile save, theme, notifications) unchanged. Appearance copy no longer references orange accents.

### Follow-up

Optional polish on analytics/chat to match the same density if requested.

---

# Important Implementation Notes

- AI path is locked: `src/services/ai/{aiService,model,prompts,context}.js` — see `AI-Architecture.md`.
- Provider-specific construction lives **only** in `model.js` (LangChain). Default: Gemini.
- Employee queries go through `src/db`; charts derive from the same dataset.
- Major learning topics belong in `Notes/` when introduced (`LangChain.md`, etc.).
- Never commit secrets; follow `Security.md`.
- Do not implement future phases early (see `Phases.md`).
- Product name remains **EmployeeAI** (BoostAI image is design reference only).

---

# Standing Agent Instructions

1. Prefer reading **Memory → Phases → relevant doc** over scanning the whole repo.
2. After meaningful decisions, append a Change Log entry here.
3. Keep Security.md in sync with any new API, env var, or data-handling pattern.
4. One phase at a time unless the user explicitly says otherwise.
5. Match the locked **ClickHouse** theme (black + electric yellow); do not invent a new palette.
