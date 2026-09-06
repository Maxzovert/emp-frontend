# EmployeeAI — Frontend

React SPA for the EmployeeAI workplace portal: landing, auth, dashboard, employees, analytics, settings (including **AI model selection**), and the AI assistant panel.

> **Add your own API key.** After sign-in, open **Settings → AI models**, paste a Gemini and/or OpenAI key that **you** created, and save. Providers stay locked until a key is configured. Never put API keys in frontend `.env` — they belong in Settings or the backend only.

**Live:** [https://employeeai-blue.vercel.app](https://employeeai-blue.vercel.app)

Companion API: see [`../backend`](../backend) · [https://emp-backend-4wcb.onrender.com](https://emp-backend-4wcb.onrender.com)  
Full HTTP reference: [`../API.md`](../API.md)

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
│   ├── components/
│   │   ├── settings/
│   │   │   ├── AiModelSettings.jsx   # Gemini / OpenAI picker + API keys
│   │   │   ├── AppearanceSettings.jsx
│   │   │   ├── NotificationSettings.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   └── SettingsView.jsx
│   │   ├── chat/                     # Assistant panel + streaming UI
│   │   └── …
│   ├── context/
│   ├── hooks/                        # useChat, useTheme, …
│   ├── layouts/
│   ├── pages/
│   ├── utils/api.js                  # apiFetch → /api (cookie credentials)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js                    # Dev proxy /api → localhost:3001
├── vercel.json                       # Prod rewrite /api → Render
├── .env.example
└── package.json
```

Path alias: `@/*` → `src/*`.

---

## Prerequisites

- Node.js **18+** (20+ recommended)
- npm
- Backend on port **3001** (local) or a deployed API
- **Your own** Gemini and/or OpenAI API key (for the assistant — configured in Settings, not in this frontend `.env`)

---

## Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**.

Leave `VITE_API_URL` empty so Vite proxies `/api` → `http://localhost:3001`.

Then sign in → **Settings → AI models** → **add your own API key** (from [Google AI Studio](https://aistudio.google.com/apikey) or [OpenAI](https://platform.openai.com/api-keys)).

---

## Environment variables

Only `VITE_*` keys are public in the browser.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Absolute API origin. Prefer **unset** (use proxy / `vercel.json`). |
| `VITE_EMAIL_NOTIFICATIONS` | No | Enables email toggles in Settings |

```env
VITE_EMAIL_NOTIFICATIONS=true
# VITE_API_URL=
```

All API calls use `src/utils/api.js` (`credentials: "include"`).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite (port 5173) |
| `npm run build` | Production → `dist/` |
| `npm run preview` | Preview build |
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
| `/settings` | Auth | Profile / appearance / **AI models** / notifications |
| `/assistant` | Auth | Opens assistant on dashboard |

Hash deep-links for settings: `/settings#ai`, `/settings#appearance`, etc.

Default theme: **light** (`localStorage` key `employeeai-theme`).

---

## Settings → AI models

UI: `AiModelSettings.jsx` (Settings sidebar → **AI models**).

**You must add your own API key** before chat works (unless the backend already has your key in env).

| UI element | Behavior |
|------------|----------|
| Gemini / OpenAI cards | Select active chat provider |
| **Locked** badge | No personal key and no server key for that provider |
| **Active** badge | Currently used for `/api/chat` |
| API key fields | Paste **your** Gemini and/or OpenAI keys (password inputs) |
| Remove key | Clears the stored user key for that provider |

Flow:

1. Create a key you own ([Gemini](https://aistudio.google.com/apikey) / [OpenAI](https://platform.openai.com/api-keys))  
2. Sign in  
3. Open **Settings → AI models**  
4. Paste **your** key → **Save** (unlocks that provider; may auto-select it)  
5. Click an unlocked card to switch the active model  
6. Chat uses the selection via the backend (keys never stay in the browser after save)

APIs used:

- `GET /api/auth/ai-settings`
- `PATCH /api/auth/ai-settings` — `{ provider?, geminiApiKey?, openaiApiKey?, clearGemini?, clearOpenai? }`

---

## Features (UI)

- **Auth** — login / register / logout
- **Dashboard** — metrics, recent people, open assistant
- **Employees** — search, filters, add / status / delete
- **Analytics** — Recharts bar + pie
- **Settings** — profile, theme, **AI models**, notifications
- **AI panel** — SSE streaming (`useChat`), markdown, local chat history

---

## Talking to the API

### Local

```text
/api/*  →  http://localhost:3001/api/*
```

### Production (Vercel)

```text
/api/:path*  →  https://emp-backend-4wcb.onrender.com/api/:path*
/health      →  https://emp-backend-4wcb.onrender.com/health
```

Update `vercel.json` if the Render host changes.

---

## Deploy (Vercel)

1. Root directory: `frontend`
2. Build: `npm run build` · Output: `dist`
3. Do **not** set `VITE_API_URL` unless you want cross-origin calls
4. Backend `FRONTEND_URL` must include this site’s origin
5. Redeploy after `vercel.json` changes

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login **404** | Check Vite proxy / `vercel.json`; redeploy |
| AI models all locked | **Add your own API key** in Settings, or set your key on the backend env |
| Cannot click OpenAI / Gemini | Provider is locked until **your** key exists |
| Chat says not configured | Save **your** key or select an unlocked provider |
| Theme stuck dark | Clear `localStorage.employeeai-theme` |
| Env not applied | Restart Vite; Vercel needs a rebuild for `VITE_*` |

---

## Related

- Backend README: [`../backend/README.md`](../backend/README.md)
- Root README: [`../README.md`](../README.md)
- API instructions: [`../API.md`](../API.md)
