# EmployeeAI — Design System & UI/UX Specification

## 1. Design Direction

EmployeeAI should look like a modern AI SaaS product.

Visual reference: Soft UI marketing/dashboard aesthetic (BoostAI-style orange primary, spacious white surfaces, rounded cards). Product name remains **EmployeeAI**.

The visual direction is:

- Minimal.
- Premium.
- Clean.
- Modern.
- Slightly futuristic.
- Professional.
- Friendly.
- Spacious.

Avoid making it look like a generic enterprise HR admin panel.

---

# 2. Visual Personality

The interface should communicate:

> Intelligent, calm, reliable, modern.

The AI should be visually prominent without making the entire application look like a chatbot.

---

# 3. Layout Principles

Use:

- Clear hierarchy.
- Generous whitespace.
- Consistent grid.
- Predictable spacing.
- Strong alignment.
- Grouped information.

Avoid:

- Crowded screens.
- Excessive borders.
- Unnecessary cards everywhere.
- Random spacing.
- Tiny text for important information.

---

# 4. Application Shell

Desktop:

```text
┌───────────────┬───────────────────────────────────┐
│               │ Header                            │
│   Sidebar     ├───────────────────────────────────┤
│               │                                   │
│               │ Main content                      │
│               │                                   │
└───────────────┴───────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│                             │
│ Main content                │
│                             │
├─────────────────────────────┤
│ Mobile navigation           │
└─────────────────────────────┘
```

---

# 5. Color System

Use a restrained Soft UI palette inspired by the BoostAI reference (product name remains **EmployeeAI**).

Define semantic tokens as CSS variables (consumed by Tailwind). Do not hard-code random hex values in components.

## Locked light-theme tokens

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#FF4D17` | CTAs, logo accent, active nav |
| `--color-primary-hover` | slightly darker orange | Primary hover |
| `--color-primary-soft` | light orange wash | Active sidebar pill, soft panels |
| `--color-bg` | `#FFFFFF` / soft gray page wash | Page background |
| `--color-surface` | `#FFFFFF` | Cards |
| `--color-surface-elevated` | white + subtle shadow | Elevated cards |
| `--color-text` | deep charcoal | Headings / body |
| `--color-text-secondary` | medium gray | Meta, labels |
| `--color-border` | light gray | Card/input borders |
| `--color-success` | mint green | Active badges, positive `%` |
| `--color-warning` | soft peach / amber | Recommend / caution insights |
| `--color-error` | soft red (accessible) | Errors |
| `--color-chart-1` | `#FF4D17` | Series 1 |
| `--color-chart-2` | mint green | Series 2 |
| `--color-chart-3` | soft yellow | Series 3 |
| Atmosphere | soft orange radial glow | Landing / shell bottom wash |

Dark theme must redefine the same token names with appropriate surfaces and readable chart colors — not a naive invert.

Semantic categories to always cover:

```text
Background
Surface
Surface Elevated
Text Primary
Text Secondary
Border
Primary
Primary Hover
Primary Soft
Success
Warning
Error
Chart 1–3
```

---

# 6. Typography

Use a modern sans-serif typeface.

Hierarchy:

```text
Display
H1
H2
H3
Body
Small
Caption
```

Guidelines:

- Large headings should be visually strong.
- Body text should remain readable.
- Secondary text should have enough contrast.
- Avoid excessive font-weight changes.

---

# 7. Spacing

Use a consistent spacing scale.

Prefer a predictable system such as:

```text
4
8
12
16
20
24
32
40
48
64
```

Do not invent a new spacing value for every component.

---

# 8. Cards

Cards should be used to group related content.

Typical card characteristics:

- Large rounded corners (`rounded-2xl` / similar Soft UI radius).
- Subtle border and/or soft shadow.
- Clear internal spacing.
- Hover feedback only where interactive.

KPI / stat cards (dashboard & analytics):

- Large metric value.
- Mint (or contextual) `%` change badge.
- Thin accent progress/spark bar in chart colors.

AI insight-style cards (dashboard prompts):

- Soft peach or mint wash backgrounds.
- Short title + body + optional primary action.

Do not put every individual sentence into a separate card.

---

# 9. Buttons

Button hierarchy:

### Primary

Main action.

Example:

> Get Started

### Secondary

Supporting action.

Example:

> Learn More

### Ghost

Low-emphasis action.

### Destructive

Actions that remove or reset information.

Buttons must have:

- Hover state.
- Focus state.
- Disabled state.
- Loading state where asynchronous.

---

# 10. Inputs

Inputs must have:

- Label.
- Clear placeholder where helpful.
- Focus state.
- Error state where validation applies.
- Disabled state.

Search inputs should communicate their purpose with a search icon.

---

# 11. Employee Cards

Recommended structure:

```text
Avatar

Name
Position
Department

Email
```

Optional:

- Status badge.
- Joined date.

Cards should remain readable on mobile.

---

# 12. Dashboard

Recommended hierarchy:

```text
Greeting
   ↓
Stats
   ↓
AI Assistant
   ↓
Recent Employees
```

The AI assistant should receive strong visual emphasis.

---

# 13. AI Assistant Design

The chat should feel calm and spacious.

### User message

Align toward the right.

### AI message

Align toward the left.

### Suggested prompts

Use compact clickable cards/buttons.

### Typing state

Use a subtle animated indicator.

### Error

Use a clear but non-alarming message with retry.

---

# 14. Analytics Design

Analytics should prioritize comprehension.

Top:

```text
Stat cards (KPI pattern from Soft UI reference)
```

Middle:

```text
Bar chart + Pie chart (required via Recharts)
Optional: smooth multi-series area/line if it clarifies workforce trends
```

Lower:

```text
Department overview
```

Charts:

- Use `--color-chart-*` tokens.
- Clear labels/legends; do not rely only on color.
- Data must come from the Neon employee dataset via analytics utilities.

---

# 15. Settings Design

Use grouped sections:

```text
Profile
Appearance
Notifications
```

Avoid one enormous settings form.

---

# 16. Dark Mode

Dark mode should be a real theme, not simply inverted colors.

Consider:

- Background hierarchy.
- Surface hierarchy.
- Text contrast.
- Border visibility.
- Chart readability.
- Input readability.

Persist theme preference.

---

# 17. Responsive Rules

### Desktop

- Sidebar visible.
- Three/four-column grids where appropriate.
- Charts may be side by side.

### Tablet

- Two-column grids.
- Reduced padding.
- Compact navigation.

### Mobile

- One-column cards.
- Stacked charts.
- Full-width inputs.
- Mobile navigation.
- Comfortable touch targets.

Avoid horizontal scrolling except where intentionally required.

---

# 18. Animation System

Animations are required.

### Landing

- Hero fade/slide.
- Staggered features.
- Dashboard preview movement.

### Dashboard

- Staggered cards.
- Chart entrance.
- AI card hover.

### Employees

- Card entrance.
- Filter transitions.

### Chat

- Message entrance.
- Typing indicator.
- Suggested prompt interaction.

### Navigation

- Active indicator movement.
- Page transition where appropriate.

---

# 19. Motion Principles

Use:

- 150–300ms for micro interactions.
- Slightly longer for page-level transitions.
- Ease-out for entrances.
- Ease-in-out for state transitions.

Avoid:

- Long blocking transitions.
- Constant animation.
- Excessive scale.
- Motion that makes content hard to read.

---

# 20. Skeleton Design

Skeletons should approximately match the final layout.

Employee skeleton:

```text
┌─────────────────────┐
│ ○   █████████       │
│     ███████         │
│                     │
│     ███████████     │
└─────────────────────┘
```

Avoid showing a generic spinner for every operation.

---

# 21. Empty State Design

Include:

- Icon/illustration.
- Short title.
- Explanation.
- Suggested action where useful.

Example:

> No employees found  
> Try a different search or department.

---

# 22. Error State Design

Include:

- Clear error icon.
- Short message.
- Retry action where applicable.

Never expose raw stack traces.

---

# 23. Accessibility

The UI should provide:

- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Sufficient contrast.
- Labels for inputs.
- Meaningful button text.
- Alternative text for meaningful images.
- Reduced-motion consideration.

Do not rely only on color to communicate state.

---

# 24. Visual Consistency Checklist

Before completion, verify:

- Same border radius system.
- Same button heights.
- Same spacing scale.
- Same typography hierarchy.
- Same icon sizing conventions.
- Same hover behavior.
- Same error styling.
- Same skeleton behavior.
- Same dark-mode logic.

---

# 25. Design Quality Goal

The application should feel like one product.

The Landing page, Dashboard, Employees, Analytics, Assistant, and Settings must share the same:

- Design language.
- Motion language.
- Typography.
- Color system.
- Component system.
