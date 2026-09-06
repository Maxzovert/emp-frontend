# Error Handling

## What is this?

Patterns that show a clear failure message and a way to recover (retry), instead of a blank screen.

## Why do we need it?

Network and AI calls fail. Users need to know what happened and what to do next.

## How does EmployeeAI use it?

- `ErrorState` on employees load failure and chat failures
- `src/app/(app)/error.js` for unexpected route errors
- API routes return `{ success: false, error }` without stack traces

## How can a beginner see and try it?

Turn off the network, open `/employees`, and use **Try again**. Or send a chat without `GOOGLE_API_KEY`.

## Where is it implemented?

- `src/components/ui/ErrorState.jsx`
- `src/app/(app)/error.js`
- `src/hooks/useChat.js`

## Important things to remember

Never show raw stack traces or API keys in the UI.
