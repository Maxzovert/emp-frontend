# Voice Input

## What is this?

Browser speech recognition (Web Speech API) that turns spoken words into chat text.

## Why do we need it?

Faster input for workplace questions — listed as a Phase 9 bonus.

## How does EmployeeAI use it?

The mic button on `/assistant` fills the chat textarea. You still press Send (or Enter) to submit.

Unsupported browsers hide the mic button.

## How can a beginner see and try it?

1. Open `/assistant` in Chrome or Edge
2. Allow microphone access
3. Click the mic, speak, then send

## Where is it implemented?

- `src/components/chat/ChatInput.jsx`

## Important things to remember

Voice text is still sent through the same `/api/chat` path — no second AI system.
