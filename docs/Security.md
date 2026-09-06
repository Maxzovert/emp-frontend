# EmployeeAI — Security Specification

## 1. Purpose

This document defines how EmployeeAI must stay secure during development and demo use.

It applies even though the current PRD excludes production authentication and real HR systems. Secure defaults now prevent accidental leaks and make a later auth upgrade safer.

**Mandatory:** Follow this file whenever adding APIs, env vars, database access, or AI calls. Update it when security-related behavior changes, and record the decision in `Memory.md`.

---

## 2. Threat Model (current scope)

### In scope risks

- Leaked API keys (AI providers, Neon).
- Secrets committed to git.
- SQL injection via search/filter inputs.
- XSS via rendered employee or AI text.
- Prompt injection that tries to extract secrets or invent confidential data.
- Over-exposed API routes that return more data than the UI needs.
- Client-side exposure of server credentials.

### Out of scope for now (but design for later)

- Full production auth / SSO.
- Multi-tenant isolation.
- Real PII compliance programs.
- DDoS / enterprise WAF.

When auth is added later, extend this document — do not invent ad-hoc security in components.

---

## 3. Secrets & Environment Variables

### Never commit

```text
.env
.env.local
.env.*.local
```

### Do commit

```text
.env.example
```

Document variable *names* only — never real values.

### Required pattern (Next.js)

| Variable | Where it may exist | Notes |
|---|---|---|
| `DATABASE_URL` | Server only | Neon connection string |
| `AI_PROVIDER` | Server only | `gemini` (default) \| `openai` \| … |
| `GOOGLE_API_KEY` or `GEMINI_API_KEY` | Server only | Gemini via LangChain |
| `OPENAI_API_KEY` | Server only | Only if/when OpenAI enabled |
| `AI_MODEL_NAME` | Server only | Optional model id override |

### Forbidden

- `NEXT_PUBLIC_` prefix on any secret.
- Hard-coding keys in source, README, Notes, screenshots, or prompts.
- Logging full connection strings or API keys.
- Pasting secrets into chat transcripts that get committed.

### Local setup

1. Copy `.env.example` → `.env.local`.
2. Fill values privately.
3. Confirm `.gitignore` includes `.env*`.

---

## 4. AI Security

### Server-only calls

```text
Browser → Next.js /api/chat → aiService → LangChain model (Gemini default)
```

Never call the provider or LangChain from client components with a real key.

Module split (see `AI-Architecture.md`):

- `model.js` — provider factory only
- `prompts.js` — system rules / templates
- `context.js` — minimal Neon-backed context
- `aiService.js` — orchestration + normalized errors

### Prompt boundaries

The system prompt / service instructions must require the model to:

- Use only supplied application context for employee facts.
- Not invent employees, salaries, policies, or confidential data.
- Not request or repeat secrets, API keys, or connection strings.
- Refuse jailbreak-style attempts to ignore rules.
- State clearly when information is unavailable.

### Context hygiene

When attaching employee mock/DB rows as AI context:

- Send only fields needed for the question (e.g. name, department, position — not fabricated sensitive fields).
- Do not include passwords, tokens, or personal secrets in context (none should exist in seed data).
- Cap context size to avoid dumping the entire database into every request.

### Output handling

- Treat AI text as untrusted for HTML: render as text, not raw HTML.
- Show user-friendly errors; never surface provider stack traces or key material.

### Rate & abuse (minimum)

- Validate message length on the API route.
- Reject empty / oversized payloads.
- Prefer simple per-IP or per-session throttling if abuse appears during demos.

---

## 5. Database Security (Neon Postgres)

### Connection

- Use `DATABASE_URL` from server env only.
- Prefer SSL connections as required by Neon.
- Do not expose the DB to the public internet beyond Neon’s secured endpoint.

### Queries

- **Always** use parameterized queries / a query builder that parameterizes.
- Never concatenate user input into SQL strings.

Bad:

```js
`SELECT * FROM employees WHERE name = '${search}'`
```

Good:

```js
// parameterized — exact API depends on client (e.g. neon/serverless, pg)
`SELECT * FROM employees WHERE name ILIKE $1`  // with values: [`%${search}%`]
```

### Schema hygiene

Seed and store only assignment-appropriate fields, e.g.:

- id, name, department, position, email, avatar, status, joinedAt

Do **not** seed:

- Passwords, SSN/government IDs, payroll, health data, real personal addresses of real people.

### Access layer

All DB access goes through a dedicated module (e.g. `lib/db/` + repositories). Pages and components must not open ad-hoc DB connections with inline SQL scattered everywhere.

### Migrations / seed

- Seed scripts must not print secrets.
- Production-like deploys should not use demo credentials in public repos.

---

## 6. API Route Security

### Principles

- Validate and sanitize inputs (search strings, IDs, chat messages).
- Return minimal JSON needed by the UI.
- Use consistent error shapes without internal details.
- Prefer HTTP method correctness (`GET` read, `POST` chat, etc.).

### Employee APIs

- Search/filter inputs: length limits, trim, reject control characters if needed.
- IDs: validate format before querying.

### Chat API

- Require non-empty message string.
- Max length (e.g. 1–2k characters unless product says otherwise).
- Do not echo secrets in error responses.

### CORS / exposure

For a same-origin Next.js app, keep APIs same-origin. Do not open wildcard CORS for credentialed admin APIs without a reason.

---

## 7. Frontend / XSS

- Use React/Next default escaping for text.
- Do not use `dangerouslySetInnerHTML` for AI or user content.
- Sanitize if rich text is ever introduced (not required now).
- Keep third-party scripts minimal; prefer known packages from `Rules.md`.

---

## 8. Authentication

### Current

EmployeeAI uses **email/password auth** backed by Neon Postgres:

- Passwords hashed with **bcryptjs** (never stored plaintext).
- Session = signed JWT (`jose`) in HTTP-only cookie `employeeai_session`.
- Middleware protects `/dashboard`, `/assistant`, `/employees`, `/analytics`, `/settings`.
- Env: `AUTH_SECRET` (required for production; dev fallback exists but must not ship).
- APIs: `POST /api/auth/login|register|logout`, `GET /api/auth/me`, `PATCH /api/auth/profile`.

Demo seed user: `john.carter@employeeai.app` / `password123` (`npm run db:seed-users`).

### Still required

- Prefer HTTPS in production (`secure` cookie flag is on when `NODE_ENV=production`).
- Do not log passwords or session tokens.
- CSRF: same-site `lax` cookies + same-origin form/fetch for mutations.

### Future upgrades

- Auth.js / Clerk / SSO if requirements expand.
- Rate-limit login/register endpoints.
- Email verification / password reset.

---

## 9. Dependency & Supply Chain

- Prefer packages already listed in Architecture/Rules.
- Avoid random npm packages for trivial helpers.
- Do not commit `node_modules`.
- Review lockfile changes in PRs when applicable.

---

## 10. Logging & Privacy

- Log operational errors, not request bodies that may contain PII beyond need.
- Never log `Authorization` headers, API keys, or `DATABASE_URL`.
- Demo analytics should use synthetic employees only.

---

## 11. Git & Collaboration

Before every commit, mentally check:

- [ ] No `.env.local`
- [ ] No keys in source
- [ ] No secrets in Notes or screenshots
- [ ] `.env.example` has placeholders only

If a secret is committed accidentally: rotate the key immediately, remove from history if needed, and record the incident in `Memory.md`.

---

## 12. Security Definition of Done (feature checklist)

A feature that touches data, AI, or env config is not done until:

- [ ] Secrets remain server-side.
- [ ] Inputs validated.
- [ ] SQL parameterized (if DB used).
- [ ] Errors are user-safe.
- [ ] AI cannot be used as a secret oracle.
- [ ] `Security.md` / `Memory.md` updated if new threat surface appeared.

---

## 13. Incident Response (lightweight)

1. Revoke/rotate exposed keys (AI + Neon).
2. Remove secret from repo; scrub history if published.
3. Check Neon dashboard for unexpected queries.
4. Append an incident note to `Memory.md`.
5. Fix the root cause (e.g. accidental `NEXT_PUBLIC_` key).

---

## 14. Relation to Other Docs

| Doc | Relationship |
|---|---|
| `PRD.md` | Product scope; security still applies inside that scope |
| `Architecture.md` | Where services and API boundaries live |
| `Rules.md` | Everyday coding rules including env rules |
| `Memory.md` | Record security decision changes |

---

## 15. Summary Rules (memorize)

1. **No secrets in the client bundle.**
2. **No secrets in git.**
3. **Parameterized SQL only.**
4. **AI is untrusted output + constrained input.**
5. **Minimal data in every response and prompt.**
6. **Update this file when the threat surface changes.**
