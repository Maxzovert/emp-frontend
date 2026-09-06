# EmployeeAI — Complete Workflow Guide

How the product works end-to-end, and how you run and use it day to day.

---

## 1. What EmployeeAI is

EmployeeAI is an **internal workplace portal**:

1. Public **landing** page  
2. **Login / register** (accounts in Neon)  
3. Protected **workspace**: dashboard, AI assistant, employee directory, analytics, settings  

Brand stays **EmployeeAI**. Soft UI theme uses orange primary `#FF4D17`.

---

## 2. How to operate it (quick start)

### Prerequisites

- Node.js 18+  
- A Neon Postgres database (for auth + live employees)  
- A Google AI (Gemini) API key (for the assistant)

### One-time setup

```bash
cd emp
npm install
cp .env.example .env
```

Edit `.env` (or `.env.local`) and fill:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | Random string to sign session cookies |
| `GOOGLE_API_KEY` | Gemini API key |
| `AI_PROVIDER` | `gemini` (default) or `openai` |
| `AI_MODEL_NAME` | e.g. `gemini-3.6-flash` |

Then create tables and seed data:

```bash
npm run db:setup
```

That runs:

1. `db:migrate` — employees table  
2. `db:seed` — demo employees (~25)  
3. `db:seed-users` — demo login account  

### Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo login

| Field | Value |
|---|---|
| Email | `john.carter@employeeai.app` |
| Password | `password123` |

You can also create your own account on `/register`.

### Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run db:setup` | Migrate + seed employees + seed demo user |
| `npm run db:seed-users` | Only ensure demo user exists |

---

## 3. User journey (what you do in the UI)

```text
Landing (/)
    │
    ├─► Sign in (/login)  or  Create account (/register)
    │         │
    │         ▼
    │   Session cookie set (employeeai_session)
    │         │
    │         ▼
    └─► Workspace (auth required)
            │
            ├─ Dashboard   — KPIs, recent people, jump into AI
            ├─ Assistant   — Chat with Gemini (+ history / voice)
            ├─ Employees   — Search + filter directory
            ├─ Analytics   — Charts from the same employee data
            └─ Settings    — Profile (DB), theme, notifications
                    │
                    └─ Sign out (header) → cookie cleared → /login
```

### Typical session

1. Open `/` → **Sign in**  
2. Use demo credentials (or your account)  
3. Land on **Dashboard**  
4. Browse **Employees**, check **Analytics**, ask the **Assistant**  
5. Update **Profile** under Settings  
6. Click the **logout** icon in the header when done  

If you open `/dashboard` while signed out, middleware sends you to `/login?next=/dashboard`.

---

## 4. How it works under the hood

### High-level architecture

```text
Browser (React / Next.js App Router)
    │
    ├─ Pages & UI components
    ├─ AuthContext / Theme / Preferences
    │
    ▼
Next.js API routes  (/api/...)
    │
    ├─ /api/auth/*     → authService → users table + JWT cookie
    ├─ /api/employees  → employee DB helpers (or demo fallback)
    └─ /api/chat       → aiService → LangChain → Gemini
              │
              ▼
         Neon Postgres
         (employees + users)
```

### Auth flow

```text
Register / Login
    → validate email + password
    → bcrypt verify/hash
    → create JWT (jose)
    → set HTTP-only cookie: employeeai_session
    → middleware allows workspace routes

Logout
    → clear cookie
    → redirect to /login
```

Important files:

- `src/services/authService.js` — register / login / logout / profile  
- `src/lib/auth/password.js` — bcrypt  
- `src/lib/auth/session.js` — JWT cookie  
- `src/middleware.js` — protects workspace routes  
- `src/context/AuthContext.js` — client session helpers  

### Employee data flow

```text
Neon employees table
    │
    ├─► /api/employees → directory UI
    ├─► dashboard KPIs / recent list
    ├─► analytics charts (counts by dept/status)
    └─► AI context (sanitized summaries for chat)
```

If Neon is missing or empty, the app can fall back to demo employees in `src/data/employees.js`. **Auth still needs Neon.**

### AI assistant flow

```text
User types in /assistant
    → useChat hook
    → POST /api/chat
    → aiService.sendMessage()
         ├─ prompts (system instructions)
         ├─ context (safe employee snippets from Neon)
         └─ model.js → ChatGoogleGenerativeAI (Gemini)
    → reply streamed/returned to UI
```

Chat history (bonus) can live in `localStorage` on the client. API keys never leave the server.

Key files:

- `src/services/ai/aiService.js`  
- `src/services/ai/model.js`  
- `src/services/ai/prompts.js`  
- `src/services/ai/context.js`  
- `src/app/api/chat/route.js`  

### Settings / profile flow

```text
Signed in → Settings → Profile form
    → PATCH /api/auth/profile
    → update users row in Neon
    → refresh session cookie + AuthContext
    → also sync local prefs (name shown in header)
```

Theme and notification toggles stay in **browser `localStorage`** (not Neon).

---

## 5. Routes map

| Path | Auth? | Role |
|---|---|---|
| `/` | Public | Marketing landing |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | Required | Overview |
| `/assistant` | Required | AI chat |
| `/employees` | Required | Directory |
| `/analytics` | Required | Charts |
| `/settings` | Required | Profile + prefs |

### API routes

| Method | Path | Role |
|---|---|---|
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/logout` | Sign out |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/profile` | Update profile |
| GET | `/api/employees` | List employees |
| POST | `/api/chat` | AI message |

---

## 6. Folder map (where to look)

```text
emp/
├── .env / .env.example     # secrets & AI config
├── scripts/                # db:migrate, seed, seed-users
├── docs/                   # Memory, Architecture, Security, this guide
├── Notes/                  # beginner topic notes
└── src/
    ├── app/
    │   ├── (auth)/         # login, register
    │   ├── (app)/          # dashboard, assistant, …
    │   └── api/            # auth, employees, chat
    ├── components/         # UI, chat, layout, auth forms
    ├── context/            # Auth, Theme, Preferences
    ├── db/                 # Neon client, employees, users
    ├── lib/auth/           # password + session
    ├── services/           # authService + AI layer
    └── middleware.js       # route protection
```

---

## 7. Daily operator checklist

1. **Env loaded?** `DATABASE_URL`, `AUTH_SECRET`, `GOOGLE_API_KEY` present.  
2. **DB ready?** `npm run db:setup` once (or after wiping Neon).  
3. **Dev running?** `npm run dev` → localhost:3000.  
4. **Can log in?** Demo user or your register flow.  
5. **Chat works?** `/assistant` — if 404 on model, update `AI_MODEL_NAME` (currently `gemini-3.6-flash`).  
6. **Stuck on redirect loop?** Clear site cookies for localhost, then login again.

---

## 8. Common problems

| Symptom | Likely fix |
|---|---|
| Redirected to `/login` always | Not signed in, or bad/missing `AUTH_SECRET` / cookie |
| “Database is not configured” | Set `DATABASE_URL`, restart server |
| Login 500 / unable to sign in | Run `npm run db:seed-users`; check Neon connectivity |
| Chat 503 / model 404 | Change `AI_MODEL_NAME` to a current Gemini model; restart |
| Empty employees | Run `npm run db:setup` |
| Theme wrong | Toggle in header / Settings; stored in localStorage |

---

## 9. Related docs

| Doc | Use when |
|---|---|
| [README.md](../README.md) | Short install + routes |
| [Memory.md](./Memory.md) | Locked decisions for agents |
| [Flow.md](./Flow.md) | Feature-level flow diagrams |
| [Architecture.md](./Architecture.md) | Folder & data architecture |
| [AI-Architecture.md](./AI-Architecture.md) | LangChain module details |
| [Security.md](./Security.md) | Secrets, cookies, AI safety |
| [Notes/Authentication.md](../Notes/Authentication.md) | Beginner auth walkthrough |

---

## 10. Minimal mental model

```text
You operate the app with npm + .env + Neon.
Users authenticate → cookie → middleware opens the workspace.
Employees live in Postgres and feed directory, charts, and AI context.
The assistant talks to Gemini only on the server via /api/chat.
Profile is account data in Neon; theme/notifications are local prefs.
```
