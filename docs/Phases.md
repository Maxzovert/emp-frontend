# EmployeeAI — Development Phases

## 1. Purpose

The project is intentionally divided into phases.

Each phase should produce a working increment.

AI coding tools must implement one phase at a time and must not skip ahead unless explicitly instructed.

---

# Phase 0 — Documentation & Planning

### Goal

Create the project's source-of-truth documents.

### Deliverables

```text
docs/
├── PRD.md
├── Architecture.md
├── Rules.md
├── Flow.md
├── Documentation.md
├── Design.md
├── Phases.md
├── Memory.md
└── Security.md

Notes/
```

### Definition of Done

- Requirements are documented.
- Architecture is documented (Next.js + Neon).
- Rules are documented.
- Design direction is documented (BoostAI Soft UI tokens locked).
- Security baseline documented.
- Phase plan exists.
- Documentation system exists.
- Memory system exists and reflects locked stack.

---

# Phase 1 — Project Foundation

### Goal

Create the Next.js application foundation.

### Tasks

- Initialize Next.js (App Router, JavaScript).
- Configure Tailwind with design tokens (orange Soft UI).
- Install Framer Motion, Recharts, Lucide React.
- Configure Neon client scaffolding + `.env.example` (no secrets committed).
- Create folder structure per Architecture.
- Create routes and public vs app layouts.
- Create initial theme structure (light/dark tokens).

### Definition of Done

All required routes render placeholder content and navigation works.

---

# Phase 2 — Design System

### Goal

Create reusable UI foundations matching Soft UI tokens.

### Tasks

Build:

- Button.
- Card.
- Input.
- Badge.
- Avatar.
- Toggle.
- Skeleton.
- EmptyState.
- ErrorState.
- PageHeader.
- StatCard.

Establish:

- Typography.
- Spacing.
- Locked color tokens from Design.md.
- Light/dark themes.
- Common motion patterns.

### Definition of Done

Pages can use consistent reusable UI components.

---

# Phase 3 — Landing Page

### Goal

Build the public-facing product experience.

### Tasks

- Navbar.
- Hero.
- AI preview.
- Features.
- CTA.
- Footer.
- Responsive layout.
- Entrance animations.
- Hover interactions.

### Definition of Done

Landing page is polished on desktop and mobile.

---

# Phase 4 — Application Shell & Dashboard

### Goal

Build the main employee workspace.

### Tasks

- Sidebar.
- Header.
- Mobile navigation.
- Dashboard greeting.
- Stat cards.
- AI overview card.
- Recent employees.
- Responsive layout.
- Dashboard animations.

### Definition of Done

Dashboard feels like the central home of the product.

---

# Phase 5 — Employee Directory

### Goal

Create the employee discovery experience.

### Tasks

- Create Neon schema + seed (~20–30 employees).
- Data access layer (`lib/db`) with parameterized queries.
- Employee cards.
- Search.
- Department filter.
- Empty state.
- Skeleton state.
- Error-state architecture.
- Responsive grid.

### Definition of Done

A user can find employees by search and department; data comes from Neon.

---

# Phase 6 — Analytics

### Goal

Turn employee data into useful visual information.

### Tasks

- Calculate statistics.
- Total employee card.
- Active employee card.
- Department count.
- Bar chart.
- Pie chart.
- Department overview.
- Loading/skeleton presentation.
- Responsive chart layout.

### Definition of Done

Analytics are derived from the same employee dataset and render correctly.

---

# Phase 7 — AI Assistant

### Goal

Implement the core AI experience with LangChain.

### Tasks

- Chat layout under `src/components/chat/`.
- Message bubbles, input, suggested prompts, typing indicator.
- Loading / error / retry.
- `src/hooks/useChat.js`.
- `src/services/ai/`: `aiService.js`, `model.js`, `prompts.js`, `context.js`.
- `app/api/chat/route.js` → `aiService` only.
- LangChain + **Gemini** as default (`AI_PROVIDER=gemini`).
- Context from Neon via `context.js` (minimal fields).
- Follow `AI-Architecture.md` + `Security.md`.
- Notes: `Notes/LangChain.md`, `Notes/AI-Service-Layer.md`.

### Definition of Done

User can send a message and get a real Gemini response via LangChain; errors handled safely; keys server-side; UI unchanged if provider is swapped in `model.js`.

---

# Phase 8 — Settings & Persistence

### Goal

Implement user preferences.

### Tasks

- Profile form.
- Appearance settings.
- Notification settings.
- Theme persistence.
- Preference persistence.

### Definition of Done

Settings work and survive page refresh.

---

# Phase 9 — Bonus Features

Only begin after all required functionality is stable.

### Priority

1. Dark mode polish.
2. Local chat history.
3. Typing animation.
4. Voice input.
5. AI employee-data context improvements.

### Definition of Done

Bonus features do not destabilize required functionality.

---

# Phase 10 — UX State Pass

### Goal

Make every important interaction feel complete.

### Tasks

Audit:

- Loading.
- Skeletons.
- Errors.
- Empty states.
- Disabled buttons.
- Retry actions.
- Focus states.
- Hover states.

### Definition of Done

No major interaction leaves the user wondering whether something is happening.

---

# Phase 11 — Responsive & Accessibility Pass

### Goal

Validate the complete application across screen sizes.

### Tasks

Test:

- Desktop.
- Tablet.
- Mobile.
- Keyboard navigation.
- Focus states.
- Contrast.
- Touch targets.
- Reduced motion considerations.

### Definition of Done

No important layout breaks at supported sizes.

---

# Phase 12 — Final Polish & Evaluation

### Goal

Prepare the submission.

### Tasks

- Remove unused imports.
- Remove debug logs.
- Fix console errors.
- Check routes.
- Check environment configuration (`.env.example` complete; no secrets in git).
- Verify AI errors.
- Verify mobile layout.
- Verify animations.
- Verify documentation + Security.md still accurate.
- Update Memory.md.
- Update README.
- Final visual review against Soft UI tokens.

### Definition of Done

The project is buildable, demonstrable, documented, and ready for evaluation.

---

# Implementation Rule

Do not implement future phases prematurely.

For example:

During Phase 3, do not build the complete AI system.

During Phase 5, do not redesign the architecture unless a real requirement demands it.

This keeps the implementation controlled and reviewable.
