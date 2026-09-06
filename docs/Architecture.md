# EmployeeAI — Architecture

## 1. Architectural Goal

Simple enough for an assignment, structured like a real Next.js product.

Primary principle:

> Keep UI, application logic, data access, and external services separated.

AI details (LangChain modules, diagrams): **`docs/AI-Architecture.md`**.

---

## 2. High-Level Architecture

```text
Browser
  |
  v
Next.js App (App Router)
  |
  +-- Public routes (/)
  |
  +-- App shell routes
  |     /dashboard /assistant /employees /analytics /settings
  |
  +-- Server / Client Components as needed
  |
  +-- Route Handlers (app/api/*)
  |     |
  |     +-- chat → src/services/ai/aiService.js
  |     +-- employees (optional)
  |
  +-- src/
  |     +-- db (Neon)
  |     +-- services/ai (LangChain: model, prompts, context, aiService)
  |     +-- hooks, components, utils
  |
  v
Neon PostgreSQL  →  employees (seed data)

AI: LangChain model factory (default Gemini) — server-only
```

---

## 3. Technology Stack

### Core

- **Next.js** (App Router)
- **React** (via Next.js)
- **Node.js**
- **JavaScript** (`.js` / `.jsx`)

### Data

- **PostgreSQL** hosted on **Neon**
- Seed script for ~20–30 demo employees

### Styling & UI

- Tailwind CSS (design tokens / CSS variables)
- Framer Motion
- Lucide React
- Recharts

### State & persistence

- React Context for theme / shared preferences
- Hooks for chat and local UI (`useChat`)
- `localStorage` for theme, notification prefs, optional chat history
- Neon for employee source of truth

### AI

- **LangChain** (model-agnostic orchestration)
- Default provider: **Google Gemini**
- Swap later via `src/services/ai/model.js` + env (`AI_PROVIDER`)
- Server-only keys; see `AI-Architecture.md` + `Security.md`

### Security

See `docs/Security.md`.

---

## 4. Folder Structure

```text
employee-ai/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js                 # Landing /
│   │   ├── globals.css             # Soft UI tokens
│   │   ├── (app)/                  # shell (no URL segment)
│   │   │   ├── layout.js
│   │   │   ├── dashboard/page.js
│   │   │   ├── assistant/page.js
│   │   │   ├── employees/page.js
│   │   │   ├── analytics/page.js
│   │   │   └── settings/page.js
│   │   └── api/chat/route.js
│   ├── components/                 # layout, ui, chat, …
│   ├── hooks/                      # useChat, useTheme, …
│   ├── context/ThemeContext.js
│   ├── services/ai/                # LangChain boundary
│   ├── db/                         # Neon client + schema
│   ├── utils/
│   └── constants/navigation.js
├── Notes/
├── docs/
├── .env.example
└── package.json
```

App Router lives under `src/app`. Keep AI under `src/services/ai` — do not merge AI logic into components.

---

## 5. Route Architecture

```text
src/app/layout.js
|
+-- src/app/page.js                       Landing (public)
|
+-- src/app/(app)/layout.js               App shell
     |
     +-- dashboard | assistant | employees | analytics | settings
```

---

## 6. Component / Hook / Service Boundaries

| Layer | Owns | Must not own |
|---|---|---|
| `components/chat` | Rendering, local input UX | API keys, LangChain, SQL |
| `hooks/useChat` | Messages, loading, error, fetch | Provider SDKs |
| `api/chat/route` | HTTP validate + call service | Prompt prose, DB dumps |
| `aiService` | Orchestration | JSX |
| `model.js` | LangChain model instance | Business prompts / DB |
| `prompts.js` | System rules & templates | Network / DB |
| `context.js` | Safe employee snippets | UI / raw provider calls |
| `db/*` | Parameterized Neon access | AI prompts |

Preferred flow:

```text
UI → useChat → /api/chat → aiService → (context + prompts + model) → Gemini
```

---

## 7. State Architecture

### Local state

Search, filters, form fields, modals, temporary UI.

### Global state (Context)

Theme, profile/preferences when broadly shared.

### Chat

`useChat` owns messages, loading, error, send/retry.

### Persistence

| Data | Store |
|---|---|
| Employees | Neon |
| Theme / notifications / profile prefs | `localStorage` (demo) |
| Chat history (bonus) | `localStorage` |

---

## 8. Data Flow

### Employees

```text
Neon employees
      → src/db + employeeUtils
      → Employees page / Dashboard recent
      → search / department filter
      → EmployeeGrid → EmployeeCard
```

### Analytics

```text
Same employee rows
      → analyticsUtils
      → Stat cards + Recharts (bar + pie; optional area)
```

### AI

See full diagrams in `AI-Architecture.md`. Summary:

```text
ChatInput → useChat → POST /api/chat → aiService
  → context.js (Neon) + prompts.js + model.js (LangChain/Gemini)
  → { success, message } | { success: false, error }
  → ChatMessages
```

---

## 9. AI Service Boundary

```js
sendMessage({ message, history, contextOptions })
```

Returns normalized:

```js
{ success: true, message: "..." }
// or
{ success: false, error: "Unable to reach the AI service." }
```

Switching Gemini ↔ OpenAI should not rewrite chat components — only `model.js` + env.

---

## 10. Security Architecture

Summary (full rules in `Security.md`):

- Server-only env for `DATABASE_URL` and AI keys.
- No `NEXT_PUBLIC_` secrets.
- Parameterized SQL only.
- AI output treated as untrusted text.
- Minimal employee fields in `context.js`.

---

## 11. Loading / Error Architecture

```text
idle → loading → success | error | empty
```

- Lists: skeletons.
- AI: typing indicator then message or retryable error.

---

## 12. Responsive & Animation

Desktop sidebar; mobile nav; Framer Motion for purposeful entrances. Design tokens: `Design.md`.

---

## 13. Architecture Boundaries

Avoid:

- Provider / LangChain calls from client components
- SQL inside presentational components
- Hard-coded chart data disconnected from employees
- A second ad-hoc AI path for suggested prompts

Prefer:

```text
UI → Hook → API → aiService → LangChain model
Data → Utility → Charts/UI
```
