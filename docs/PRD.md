# EmployeeAI — Product Requirements Document (PRD)

## 1. Document Purpose

This document is the product source of truth for the EmployeeAI project. It defines what the product is, who it serves, what it must do, what it must not do, and how completion will be evaluated.

The implementation must follow this PRD unless a later documented decision explicitly changes a requirement.

---

## 2. Product Overview

**Product name:** EmployeeAI  
**Product type:** AI-powered internal employee workspace  
**Primary platform:** Responsive web application  
**Stack:** Next.js (App Router) + Node.js + PostgreSQL (Neon) + JavaScript  
**Visual direction:** Soft UI SaaS (BoostAI-inspired orange primary — see `Design.md`)

EmployeeAI is a modern internal company portal that combines an AI workplace assistant, employee directory, workforce analytics, and profile/settings management into one application.

The product should feel like a modern SaaS product rather than a traditional HR dashboard.

### Core experience

A user can:

1. Visit a polished landing page.
2. Enter the employee workspace.
3. Ask the AI assistant questions.
4. Search and filter employees.
5. View workforce analytics.
6. Manage profile and preferences.
7. Switch between light and dark themes.
8. See clear loading, error, empty, and success states.

---

## 3. Problem Statement

Employees often need to switch between different internal tools to:

- Find coworkers.
- Understand department information.
- Get answers to common workplace questions.
- Review basic workforce information.
- Manage personal preferences.

EmployeeAI brings these interactions into one simple interface and adds an AI assistant as the primary conversational entry point.

---

## 4. Goals

### Primary goals

- Build a polished, responsive Next.js application.
- Demonstrate strong component architecture and reusable UI.
- Demonstrate App Router navigation and clear state management.
- Integrate AI via **LangChain** (`src/services/ai/`) with default **Gemini** (swappable via `model.js` + env); server-only keys.
- Store employees in **Neon Postgres** (seeded demo data).
- Demonstrate professional UI states.
- Include meaningful animations.
- Provide a realistic employee directory.
- Provide useful analytics derived from the same employee dataset.
- Persist appropriate client-side preferences and optional chat history.
- Follow `Security.md` and `AI-Architecture.md`.
- Keep the code understandable and maintainable.

### Secondary goals

- Demonstrate AI-assisted development without allowing AI to dictate uncontrolled architecture.
- Make the application easy for another developer to understand.
- Keep docs (`Memory.md` especially) current so work can continue without full-repo rereads.

---

## 5. Non-Goals

The following are outside the required scope:

- Production authentication.
- Real employee database from an external HRIS (Neon seeded demo DB is in scope).
- Real HR/payroll system.
- Real employee editing by administrators.
- Role/permission management.
- Real company policy database.
- Sending real emails.
- Full production-grade multi-tenant infrastructure (Neon + Next API routes are in scope for demo data and AI proxying).
- Real-time collaboration.
- Enterprise SSO.
- Sensitive employee information.

These may be future extensions but should not complicate the current assignment. Demo DB + server AI proxy are intentional; full SSO/HR systems are not.

---

## 6. Target User

The primary user is an employee using an internal company portal.

The secondary audience is an evaluator/developer reviewing the project.

The UI must therefore be:

- Beginner-friendly.
- Professional.
- Fast to understand.
- Visually polished.
- Consistent.
- Easy to navigate.

---

## 7. Application Routes

| Route | Purpose |
|---|---|
| `/` | Public landing page |
| `/dashboard` | Employee workspace overview |
| `/assistant` | Full AI assistant |
| `/employees` | Employee directory |
| `/analytics` | Workforce analytics |
| `/settings` | Profile and preferences |

The dashboard routes should share a common application shell.

---

## 8. Landing Page Requirements

### Hero

Must communicate:

- What EmployeeAI is.
- Why it is useful.
- A clear primary CTA.

Suggested message:

> Your AI-powered workplace assistant.

### Features

Show the primary capabilities:

- AI Assistant.
- Employee Directory.
- Workforce Analytics.
- Personalized Workspace.

### CTA

The CTA should navigate into the dashboard/application.

### Motion

Landing animations should include purposeful:

- Entrance animations.
- Staggered feature reveals.
- Subtle dashboard preview motion.
- Hover interactions.

---

## 9. Dashboard Requirements

The dashboard should contain:

### Greeting

A personalized greeting such as:

> Good morning, John.

### Statistics

- Total Employees.
- Active Employees.
- Departments.

### AI entry point

A visually prominent AI assistant card with suggested prompts.

### Recent employees

A small list/grid of employees.

The dashboard should summarize the application rather than duplicate every feature.

---

## 10. AI Assistant Requirements

### Required

- Chat interface.
- User messages.
- AI responses.
- Message history.
- Loading state.
- Error state.
- Retry behavior.
- Input field.
- Send action.
- Suggested prompts.
- LangChain integration with Gemini as the default provider (other models via `model.js`).

### Bonus

- Local chat history.
- Typing animation.
- Voice input.

### Suggested prompts

Examples:

- Who works in Engineering?
- Show me employee statistics.
- Which departments do we have?
- Find a Product Manager.

### AI boundary

The AI must not invent confidential company facts.

For employee questions, the application should provide relevant employee records from Neon as context where appropriate.

The AI is an assistant, not an authoritative HR/legal/security system.

---

## 11. Employee Directory Requirements

Each employee record should contain at minimum:

```js
{
  id,
  name,
  department,
  position,
  email
}
```

Recommended additional fields:

```js
{
  avatar,
  status,
  joinedAt
}
```

### Required interactions

- Search.
- Department filter.
- Employee cards.
- Empty state.
- Loading/skeleton state.
- Error state where applicable.

Search should support useful employee fields such as:

- Name.
- Email.
- Position.
- Department.

---

## 12. Analytics Requirements

### Summary cards

- Total employees.
- Active employees.
- Number of departments.

### Charts

Required:

- Bar chart.
- Pie chart.

Recommended library:

**Recharts**

Charts should use the same employee dataset so the dashboard remains internally consistent.

---

## 13. Settings Requirements

### Profile

Allow the user to edit:

- Name.
- Email.
- Department.
- Position.

### Appearance

- Light mode.
- Dark mode.

### Notifications

At minimum:

- Email notifications.
- AI updates.
- Company announcements.

Preferences should persist locally.

---

## 14. UI/UX Requirements

The application must include:

- Responsive design.
- Smooth animations.
- Skeleton loaders.
- Loading states.
- Error states.
- Empty states.
- Consistent visual language.
- Hover/focus/active states.
- Accessible controls.
- Mobile-friendly navigation.

Animations are a required feature, not an optional enhancement.

---

## 15. State Management Requirements

State should be separated according to responsibility.

Recommended:

- React Context for global application preferences where appropriate.
- Local component state for local UI state.
- A custom `useChat` hook for chat behavior.
- `localStorage` for client persistence (theme, notifications, optional chat history).
- Neon Postgres for employee records (source of truth for directory + analytics).

Do not introduce Redux merely to satisfy the phrase "state management."

---

## 16. Data Requirements

Employees are stored in **Neon PostgreSQL** and seeded for demo use.

The dataset should contain enough employees to demonstrate:

- Search.
- Filtering.
- Multiple departments.
- Charts.
- Empty states.

Recommended size: 20–30 employee records.

Analytics must be computed from this same dataset (not a disconnected hard-coded chart file).

---

## 17. Quality Requirements

The final application must:

- Build successfully.
- Have no obvious console errors.
- Have no broken routes.
- Work on desktop and mobile.
- Have no exposed secret API key in committed client code.
- Handle API failures gracefully.
- Avoid duplicated components.
- Use meaningful component names.
- Keep pages reasonably small.
- Maintain consistent spacing and typography.

---

## 18. Acceptance Criteria

The project is complete when:

### Navigation

- All required routes work.
- Navigation does not require full page reloads.
- Active navigation state is visible.

### AI

- User can send a message.
- Loading state is visible.
- AI response is displayed.
- API errors are handled.
- Suggested prompts work.
- Chat history is maintained during the session.
- Local persistence exists if bonus scope is implemented.

### Employees

- Employee cards render.
- Search works.
- Department filter works.
- Empty state works.

### Analytics

- Summary cards render.
- Bar chart renders.
- Pie chart renders.
- Chart data corresponds to employee data.

### Settings

- Profile form works.
- Theme toggle works.
- Notification preferences work.
- Preferences persist locally.

### UX

- Responsive layout works.
- Skeletons exist.
- Loading states exist.
- Error states exist.
- Empty states exist.
- Animations are clearly visible but not excessive.

---

## 19. Success Definition

A successful submission should make an evaluator think:

> "This is a coherent product built with deliberate Next.js architecture, not a collection of disconnected demo screens."

The quality of the implementation matters more than the number of extra features.

Security expectations for keys, SQL, and AI are defined in `docs/Security.md`.
