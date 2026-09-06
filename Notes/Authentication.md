# Authentication

## What is this?

Authentication proves who you are (login). Authorization decides what you can access. EmployeeAI uses email/password accounts stored in Neon, with a signed JWT in an HTTP-only cookie for the session.

## Why do we need it?

Protected routes (`/dashboard`, `/assistant`, `/employees`, `/analytics`, `/settings`) should not be open to anyone who knows the URL. Profile edits should stick to a real user row, not only browser `localStorage`.

## How does EmployeeAI use it?

1. Register or sign in → password is hashed with **bcryptjs** → session JWT is set as `employeeai_session`.
2. **Middleware** checks the cookie before allowing workspace pages.
3. **Header** shows the signed-in name and a Sign out control.
4. **Settings → Profile** saves through `PATCH /api/auth/profile` when logged in.

Demo account (seeded by `npm run db:seed-users`):

- Email: `john.carter@employeeai.app`
- Password: `password123`

## How can a beginner see and try it?

1. Ensure `DATABASE_URL` and `AUTH_SECRET` are in `.env`.
2. Run `npm run db:seed-users` (or full `npm run db:setup`).
3. Open `/login`, sign in with the demo credentials.
4. Visit `/settings`, change your name, save, refresh — name should persist.
5. Click the logout icon in the header — you should land on `/login` and `/dashboard` should redirect back to login.

## Where is it implemented?

- `src/lib/auth/password.js` — hash / verify
- `src/lib/auth/session.js` — JWT cookie helpers
- `src/db/users.js` — `users` table CRUD
- `src/services/authService.js` — register / login / logout / profile
- `src/app/api/auth/*` — HTTP endpoints
- `src/middleware.js` — route protection
- `src/context/AuthContext.js` — client session state
- `src/app/(auth)/login` + `register` — UI
- `scripts/seed-users.mjs` — demo user seed

## Important things to remember

- Never store plaintext passwords.
- Session cookie is `httpOnly` (JS cannot read it).
- Set a real `AUTH_SECRET` in production.
- Auth requires Neon (`DATABASE_URL`); without it, login returns a clear error.
