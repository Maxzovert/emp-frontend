# Dark Mode

## What is this?

A real dark theme using Soft UI tokens (layered surfaces), not a simple color invert.

## Why do we need it?

Readable night-time use and PRD appearance requirements.

## How does EmployeeAI use it?

`.dark` on `<html>` toggles CSS variables. Theme is chosen in Settings or the header and saved as `employeeai-theme`.

## How can a beginner see and try it?

Toggle dark mode in `/settings` → Appearance, then open `/analytics` and `/assistant` to check charts and chat contrast.

## Where is it implemented?

- `src/app/globals.css`
- `src/context/ThemeContext.js`
- `src/components/settings/AppearanceSettings.jsx`

## Important things to remember

Prefer token colors (`bg-surface`, `text-muted`) so both themes stay consistent.
