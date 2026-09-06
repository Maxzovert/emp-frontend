# Custom Hooks

## What is this?

Reusable React functions that hold stateful behavior (prefix `use`).

## Why do we need it?

Keeps chat, theme, and storage logic out of bulky page components.

## How does EmployeeAI use it?

- `useChat` — messages, loading, error, history, send/retry
- `useTheme` — light/dark
- `useLocalStorage` — generic persistence helper
- `usePreferences` — profile + notifications (context)

## How can a beginner see and try it?

Open `/assistant`, send a message, refresh — `useChat` reloads history from localStorage.

## Where is it implemented?

- `src/hooks/*`
- `src/context/*`

## Important things to remember

Hooks that call APIs or storage should not live inside pure presentational components.
