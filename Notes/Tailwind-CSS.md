# Tailwind CSS

## What is this?

Tailwind is a utility-first CSS framework. EmployeeAI also defines **design tokens** (CSS variables) for the Soft UI orange theme.

## Why do we need it?

Consistent spacing, colors, and dark mode without large custom CSS files per component.

## How does EmployeeAI use it?

Tokens live in `src/app/globals.css` (`--color-primary: #ff4d17`, etc.). Classes like `bg-primary`, `text-muted`, `rounded-2xl` map to those tokens via `@theme inline`.

## How can a beginner see and try it?

Change `--color-primary` in `globals.css`, refresh the landing CTA — it should update.

## Where is it implemented?

- `src/app/globals.css`
- `postcss.config.mjs`

## Important things to remember

Do not invent a new palette; use the locked Soft UI tokens from `docs/Design.md`.
