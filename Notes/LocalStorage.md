# LocalStorage

## What is this?

`localStorage` is browser storage that keeps small data after you close the tab.

## Why do we need it?

Theme, profile, and notification prefs should persist without a full auth backend.

## How does EmployeeAI use it?

| Key | Data |
|---|---|
| `employeeai-theme` | `light` / `dark` |
| `employeeai-profile` | name, email, department, position |
| `employeeai-notifications` | email, aiUpdates, announcements |
| `employeeai-chat-history` | assistant messages (Phase 9 bonus) |

## How can a beginner see and try it?

DevTools → Application → Local Storage → change `employeeai-profile` name → refresh `/dashboard`.

## Where is it implemented?

- `src/context/ThemeContext.js`
- `src/context/PreferencesContext.js`
- `src/hooks/useLocalStorage.js`

## Important things to remember

Do not store API keys or secrets in localStorage.
