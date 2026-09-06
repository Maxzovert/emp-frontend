# Landing Page

## What is this?

The public `/` page that introduces EmployeeAI and routes people into the app.

## Why do we need it?

Evaluators and users need a polished first impression before the workspace shell.

## How does EmployeeAI use it?

Sections:

1. Sticky navbar (links + theme + open workspace)
2. Hero (brand, headline, CTAs) + animated dashboard preview
3. Features (AI, Directory, Analytics, Personalized workspace)
4. Final CTA → dashboard
5. Footer

## How can a beginner see and try it?

```bash
npm run dev
```

Open `http://localhost:3000`. Resize to mobile to check the menu.

## Where is it implemented?

- `src/app/page.js`
- `src/components/landing/*`
- `src/components/layout/LandingNavbar.jsx`

## Important things to remember

Keep Soft UI tokens; brand name stays visually strong in the hero; motion stays purposeful.
