# EmployeeAI — AI Architecture (LangChain)

## 1. Purpose

EmployeeAI uses **LangChain** as a model-agnostic layer so the app can switch providers (Gemini now; OpenAI, Anthropic, etc. later) **without rewriting chat UI or hooks**.

Current default provider: **Google Gemini**.

Canonical module layout:

```text
src/
├── services/
│   └── ai/
│       ├── aiService.js    # Public API used by /api/chat
│       ├── model.js        # LangChain chat model factory (swap providers here)
│       ├── prompts.js      # System + prompt templates
│       └── context.js      # Build safe employee context from Neon
│
├── hooks/
│   └── useChat.js          # Client chat state (messages, loading, error, send)
│
└── components/
    └── chat/               # Pure UI (bubbles, input, typing, prompts)
```

API entry: `app/api/chat/route.js` → calls `aiService` only (never imports a provider SDK in the route beyond that).

---

## 2. End-to-end flow (big picture)

```text
┌─────────────┐     POST /api/chat      ┌──────────────────┐
│  Chat UI    │ ───────────────────────► │  route.js        │
│  components │ ◄─────────────────────── │  validate body   │
│  + useChat  │   { success, message }   └────────┬─────────┘
└─────────────┘                                   │
                                                  ▼
                                         ┌──────────────────┐
                                         │  aiService.js    │
                                         │  orchestrates    │
                                         └───┬────┬────┬────┘
                         ┌───────────────────┘    │    └───────────────────┐
                         ▼                        ▼                        ▼
                ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                │  context.js     │    │  prompts.js     │    │  model.js       │
                │  employee rows  │    │  system rules   │    │  LangChain LLM  │
                │  from Neon      │    │  + user msg     │    │  (Gemini now)   │
                └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
                         │                      │                      │
                         └──────────┬───────────┴──────────────────────┘
                                    ▼
                           LangChain invoke / chain
                                    │
                                    ▼
                           Provider API (Gemini)
```

**Rule:** UI never talks to Gemini or LangChain directly. Only `aiService` (server) does.

---

## 3. File-by-file responsibilities

### 3.1 `model.js` — “which brain?”

**What:** Creates a LangChain chat model instance from env config.

**Why:** Swapping Gemini → OpenAI is a one-file (or config) change.

```text
                    AI_PROVIDER=gemini (default)
                              │
                              ▼
                     ┌─────────────────┐
                     │ getChatModel()  │
                     └────────┬────────┘
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
    ChatGoogleGenerativeAI  ChatOpenAI      (future…)
         (Gemini)           (optional)
```

Env (server-only):

| Variable | Role |
|---|---|
| `AI_PROVIDER` | `gemini` (default) \| `openai` \| … |
| `GOOGLE_API_KEY` / `GEMINI_API_KEY` | Gemini |
| `OPENAI_API_KEY` | Later, if enabled |
| `AI_MODEL_NAME` | Optional override (e.g. `gemini-3.6-flash`) |

Returns a LangChain-compatible chat model. **No prompts, no DB, no HTTP here.**

---

### 3.2 `prompts.js` — “what should the AI believe and say?”

**What:** System prompt + message templates (LangChain `ChatPromptTemplate` or plain structured messages).

**Why:** Keep wording and safety rules out of components and out of `model.js`.

```text
┌──────────────────────────────────────────┐
│ prompts.js                               │
│                                          │
│  SYSTEM: You are EmployeeAI assistant…   │
│          - Use only supplied context     │
│          - Do not invent employees       │
│          - No secrets / no authority     │
│                                          │
│  HUMAN:  {userMessage}                   │
│  CONTEXT block {employeeContext}           │
└──────────────────────────────────────────┘
```

Aligns with `Security.md` prompt boundaries.

---

### 3.3 `context.js` — “what company facts may the AI see?”

**What:** Builds a **minimal, capped** text/JSON context from Neon employee data for a given question.

**Why:** Ground answers in real rows; avoid dumping the whole DB; avoid sensitive fields.

```text
User question
      │
      ▼
┌─────────────┐     parameterized      ┌──────┐
│ context.js  │ ─────────────────────► │ Neon │
│ filter/limit │ ◄───────────────────── │      │
└──────┬──────┘   id, name, dept,      └──────┘
       │          position, status…
       ▼
  "Employee context:\n- Ada Lee, Engineering, …"
```

Allowed fields (typical): `id`, `name`, `department`, `position`, `status` (email only if needed).

Never: passwords, keys, payroll, health, government IDs.

---

### 3.4 `aiService.js` — “one public function for the app”

**What:** The only AI entry point other modules should call.

**Preferred interface:**

```js
sendMessage({ message, history, contextOptions })
→ { success: true, message: "..." }
→ { success: false, error: "Unable to reach the AI service." }
```

**Internal steps:**

```text
sendMessage()
   │
   ├─1─ validate message (non-empty, max length)
   ├─2─ context.js → employeeContext
   ├─3─ prompts.js → messages / chain inputs
   ├─4─ model.js → llm
   ├─5─ LangChain invoke (optionally with history)
   └─6─ normalize result or safe error
```

UI/hooks stay stable if the provider changes.

---

### 3.5 `app/api/chat/route.js` — HTTP boundary

```text
Client fetch
    │
    ▼
POST /api/chat
    │  parse JSON
    │  validate
    │  call aiService.sendMessage
    │
    ▼
JSON response (no keys, no stack traces)
```

---

### 3.6 `hooks/useChat.js` — client orchestration

```text
┌─────────────────────────────────────┐
│ useChat                             │
│  state: messages, loading, error    │
│                                     │
│  sendMessage(text)                  │
│    → append user bubble             │
│    → loading / typing               │
│    → fetch /api/chat                │
│    → append AI bubble OR set error  │
│  retry()                            │
└─────────────────────────────────────┘
         │
         ▼
   chat components (dumb UI)
```

No LangChain, no API keys, no Neon in this hook.

---

### 3.7 `components/chat/` — presentation only

Typical pieces:

| Component | Role |
|---|---|
| `ChatHeader` | Title / status |
| `ChatMessages` | List of bubbles |
| `MessageBubble` | User vs AI alignment |
| `ChatInput` | Text + send |
| `TypingIndicator` | Loading UX |
| `SuggestedPrompts` | Click → `useChat.sendMessage` |

```text
Assistant page
     │
     ├── ChatHeader
     ├── SuggestedPrompts ──► useChat
     ├── ChatMessages
     │      └── MessageBubble
     ├── TypingIndicator
     └── ChatInput ──────────► useChat
```

---

## 4. Concept diagrams

### 4.1 Why LangChain?

```text
WITHOUT LangChain          WITH LangChain
─────────────────          ────────────────────────────
UI → Gemini SDK            UI → aiService → model.js
UI → OpenAI SDK   ✗        UI → aiService → model.js  ✓
(duplicate logic)          (one interface, swap model)
```

### 4.2 History (session)

```text
messages[] in useChat
        │
        │  send last N turns (capped)
        ▼
   aiService / prompts
        │
        ▼
   LangChain chat messages
   (system + context + history + user)
```

### 4.3 Suggested prompts

```text
SuggestedPrompts click
        │
        ▼
same sendMessage path as typing
(no second AI system)
```

### 4.4 Error path

```text
Provider/network failure
        │
        ▼
aiService → { success: false, error: friendly }
        │
        ▼
useChat.error + Retry
(no raw SDK errors in UI)
```

---

## 5. Switching models later

1. Add package for the new provider (LangChain integration).
2. Extend `model.js` switch on `AI_PROVIDER`.
3. Set env keys server-side.
4. **Do not** change `useChat` or chat components.

```text
AI_PROVIDER=gemini  → ChatGoogleGenerativeAI
AI_PROVIDER=openai  → ChatOpenAI
```

---

## 6. Security ties

- Keys only in server env (`Security.md`).
- `context.js` minimizes fields and row count.
- `prompts.js` encodes non-fabrication + no-secrets rules.
- Render AI text as text, never `dangerouslySetInnerHTML`.

---

## 7. Implementation phase

Built in **Phase 7** (`Phases.md`). Scaffold folders in Phase 1 if useful; do not wire real Gemini until Phase 7 unless the user explicitly advances scope.

---

## 8. Beginner note

When implemented, add `Notes/LangChain.md` and `Notes/AI-Service-Layer.md` using the four-question template in `Documentation.md`.
