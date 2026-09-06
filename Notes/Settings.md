# Settings & Persistence

## What is this?

The `/settings` page for profile, appearance (theme), and notification preferences.

## Why do we need it?

Users should personalize the workspace and keep those choices after a refresh.

## How does EmployeeAI use it?

```text
PreferencesProvider (localStorage)
  ├── profile → greeting + header avatar
  └── notifications → toggles on Settings

ThemeProvider (localStorage)
  └── light / dark
```

Sections: ProfileForm, AppearanceSettings, NotificationSettings.

## How can a beginner see and try it?

1. Open `/settings`
2. Change your name → Save profile
3. Refresh — greeting on `/dashboard` and header name should update
4. Toggle dark mode and notification switches — they survive refresh

## Where is it implemented?

- `src/components/settings/*`
- `src/context/PreferencesContext.js`
- `src/context/ThemeContext.js`
- `src/app/(app)/settings/page.js`

## Important things to remember

Preferences are browser-local (demo scope), not stored in Neon.
