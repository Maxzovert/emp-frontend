# EmployeeAI — Engineering Rules

## 1. Purpose

Mandatory conventions unless changed and recorded in `Memory.md`.

---

## 2. Core Coding Rules

### Rule 1 — JavaScript only

Use `.js` / `.jsx`. Do not introduce TypeScript unless requirements change and Memory records it.

### Rule 2 — Keep components focused

One clear responsibility per component (e.g. `EmployeeCard`, `DepartmentFilter`).

### Rule 3 — Reuse before duplicating

Shared UI → `components/ui/*` (Button, Card, StatCard, EmptyState, …).

### Rule 4 — Keep docs in sync

When stack, security, design tokens, or architecture change, update the relevant `docs/` files **and** append `Memory.md` in the same session. Do not wait for the user to ask again.

### Rule 5 — One phase at a time

Follow `Phases.md`. Do not skip ahead unless the user explicitly instructs.

---

## 3. Library Rules

### Required / preferred

| Area | Choice |
|---|---|
| App | Next.js (App Router) |
| Runtime | Node.js |
| DB | Neon Postgres |
| Styles | Tailwind CSS |
| Motion | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Global state | React Context (justified use only) |
| Client persistence | `localStorage` |
| AI | LangChain (default Gemini); swap via `model.js` + `AI_PROVIDER` |

### Avoid unnecessary libraries

Ask: required? solvable with current stack? complexity worth it? maintained?

---

## 4. Styling Rules

- Use design tokens from `Design.md` (orange Soft UI).
- Do not invent a new palette.
- Consistent spacing, radius, shadows, typography.
- Avoid random colors, excessive glassmorphism, inconsistent radii.

---

## 5. Responsive Rules

Every feature: desktop, tablet, mobile. Check nav, cards, forms, charts, chat, lists, buttons.

---

## 6. Animation Rules

Required. Use Framer Motion for purposeful entry/feedback. Avoid long, blocking, or constant motion.

---

## 7. Loading / Error / Empty Rules

- Async work must show progress (skeletons, typing indicator, button loading).
- Errors: what happened, why it might have, what to do next; retry when useful.
- Empty states: what / why / next action.
- Never blank screens or raw stack traces.

---

## 8. AI Rules

- Use **LangChain** through `src/services/ai/` only — see `AI-Architecture.md`.
- Default provider: **Gemini**. Do not call Gemini/OpenAI SDKs from components or `useChat`.
- Not legal/HR/security authority; no fabricated company facts.
- Employee answers use supplied DB/context from `context.js` only.
- Concise answers; no secrets; refuse credential requests.
- Server-only keys — see `Security.md`.
- Suggested prompts must call the same `sendMessage` path (no second AI system).

---

## 9. API & Data Rules

```text
Component → Hook or Server action → Service / DB → External
```

- Parameterized SQL only.
- Validate inputs on API routes.
- Handle success, loading, failure, unexpected shapes.

---

## 10. Environment Rules

Never commit `.env` / `.env.local`. Use `.env.example` with placeholders. Never put secrets in `NEXT_PUBLIC_*`, README, Notes, or screenshots.

---

## 11. State Rules

Local state for local UI. Context for shared prefs/theme. No Redux unless justified.

---

## 12. File Rules

Descriptive names (`EmployeeCard.jsx`, `useChat.js`, `aiService.js`). No `Comp1`, `FinalFinal`.

---

## 13. Documentation Rules

Major concepts → `Notes/` with the four questions (`Documentation.md`).

---

## 14. Memory Rules

Append decisions to `Memory.md` (date, change, reason, files, impact, follow-up). Do not rewrite history.

---

## 15. Security Rules

Follow `docs/Security.md` for secrets, SQL, AI, XSS, and API exposure.

---

## 16. Cursor / AI Coding Rules

Before changing architecture: read Memory + relevant docs; smallest change; avoid unrelated rewrites; no duplicate systems; no deleting working features to fix a local issue; no unjustified dependencies.

---

## 17. Definition of Done

Works, responsive, loading/error/empty as needed, required animation, architecture + security followed, no console errors, Notes updated when a major concept is introduced, Memory updated when decisions change.

---

## 18. Avoid List

- Monolithic pages that own everything
- Client-side AI keys
- String-built SQL
- Hard-coded chart data disconnected from employees
- Fake buttons
- Broken mobile layouts
- Secrets in source control
- Overengineering
- Doc drift (code says Next/Neon, docs still say Vite/mock only)
