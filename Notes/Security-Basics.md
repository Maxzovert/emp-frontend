# Security Basics

## What is this?

Rules that keep secrets and employee data safer in this demo app.

## Why do we need it?

Keys in the browser or git are easy to leak. Bad SQL is easy to inject.

## How does EmployeeAI use it?

- AI keys + `DATABASE_URL` are server-only
- Chat goes through `/api/chat` → LangChain
- Neon queries use parameterized tagged templates
- AI context includes emails and caps rows

Full policy: `docs/Security.md`.

## How can a beginner see and try it?

Inspect Network for `POST /api/chat` — the request body has the message, not `GOOGLE_API_KEY`.

## Where is it implemented?

- `src/services/ai/*`
- `src/db/*`
- `docs/Security.md`

## Important things to remember

Never commit `.env`. Never use `NEXT_PUBLIC_` for secrets.
