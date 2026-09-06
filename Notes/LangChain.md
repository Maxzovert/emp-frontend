# LangChain

## What is this?

LangChain is a library that talks to AI models through one interface, so you can swap Gemini for OpenAI without rewriting the chat UI.

## Why do we need it?

EmployeeAI should stay model-agnostic. Provider details belong in `model.js`, not in React components.

## How does EmployeeAI use it?

```text
useChat → POST /api/chat → aiService
  → context.js (employees)
  → prompts.js (system + history)
  → model.js (ChatGoogleGenerativeAI by default)
  → llm.invoke(messages)
```

## How can a beginner see and try it?

1. Add `GOOGLE_API_KEY` to `.env.local`
2. `npm run dev` → `/assistant`
3. Ask: “Who works in Engineering?”

To try OpenAI later: set `AI_PROVIDER=openai` and `OPENAI_API_KEY`.

## Where is it implemented?

- `src/services/ai/model.js`
- `src/services/ai/aiService.js`
- `src/services/ai/prompts.js`

## Important things to remember

API keys are server-only. Never import LangChain into client components.
