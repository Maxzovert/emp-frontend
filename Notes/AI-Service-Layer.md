# AI Service Layer

## What is this?

A server-only boundary that turns a user message into a safe AI reply.

## Why do we need it?

Keeps keys, prompts, and database context out of the browser, and keeps the UI stable when the model changes.

## How does EmployeeAI use it?

Public function:

```js
sendMessage({ message, history })
→ { success: true, message }
→ { success: false, error }
```

Called only from `src/app/api/chat/route.js`.

## How can a beginner see and try it?

Open browser DevTools → Network → send a chat message → inspect `POST /api/chat` JSON (no API key in the payload).

## Where is it implemented?

- `src/services/ai/aiService.js`
- `src/services/ai/context.js`
- `src/hooks/useChat.js`
- `src/components/chat/*`

## Important things to remember

Suggested prompts use the same `sendMessage` path — no second AI system.
