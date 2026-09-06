# EmployeeAI — Application Flow

## 1. Product Flow

```text
Landing Page
    |
    | Get Started
    v
Dashboard
    |
    +--> AI Assistant
    |
    +--> Employees
    |
    +--> Analytics
    |
    +--> Settings
```

---

# 2. Landing Flow

```text
User opens /
    |
    v
Hero
    |
    +--> Learn about product
    |
    +--> View features
    |
    v
CTA
    |
    v
/dashboard
```

---

# 3. Application Navigation Flow

```text
AppLayout
 |
 +-- Sidebar
 |    |
 |    +-- Dashboard
 |    +-- Assistant
 |    +-- Employees
 |    +-- Analytics
 |    +-- Settings
 |
 +-- Header
 |
 +-- Page Content
```

On mobile, the sidebar becomes mobile navigation.

---

# 4. Dashboard Flow

```text
Dashboard
   |
   +--> Load employee data (Neon)
   |
   +--> Calculate statistics
   |
   +--> Show AI suggestions / insight-style prompt cards
   |
   +--> Show recent employees
```

The dashboard is a summary layer.

It should not duplicate the complete directory or analytics page.

---

# 5. Employee Directory Flow

```text
Employees Page
    |
    v
Load employees from Neon (via data layer / API)
    |
    +--> loading
    |      |
    |      v
    |   skeletons
    |
    +--> success
    |      |
    |      v
    |   employee list
    |
    +--> error
           |
           v
        error state
```

### Search flow

```text
User types
   |
   v
Search state updates
   |
   v
Filter employee dataset
   |
   v
Render results
```

### Department flow

```text
Select department
      |
      v
Filter employees
      |
      v
Render results
```

### Empty flow

```text
Filters/search
    |
    v
0 matching employees
    |
    v
EmptyState
```

---

# 6. Analytics Flow

```text
Neon Employee Dataset
      |
      v
Analytics Utilities
      |
      +--> Total count
      +--> Active count
      +--> Department count
      +--> Department distribution
      |
      v
Dashboard / Analytics Cards
      |
      +--> Bar Chart
      |
      +--> Pie Chart
      |
      +--> Optional area chart (Soft UI style)
```

The charts must derive their data from the same underlying employee dataset in Neon.

---

# 7. AI Chat Flow

```text
User enters message
        |
        v
Validate (client + API)
        |
        v
useChat appends user message, loading=true
        |
        v
POST /api/chat
        |
        v
aiService.sendMessage
        |
        +--> context.js  (Neon, capped fields)
        +--> prompts.js  (system + templates)
        +--> model.js    (LangChain → Gemini)
        |
        v
LangChain invoke
        |
   +----+----+
   |         |
 success    error
   |         |
   v         v
AI message  friendly error + retry
```

Diagrams per file: `docs/AI-Architecture.md`. Security: `docs/Security.md`.

---

# 8. AI Suggested Prompt Flow

```text
Suggested Prompt
      |
      v
Populate/send prompt
      |
      v
Chat flow
```

A suggestion should never create a second, separate AI system.

---

# 9. Chat Persistence Flow

If bonus local history is enabled:

```text
New message
    |
    v
messages state
    |
    v
localStorage
```

On app initialization:

```text
localStorage
    |
    v
read saved messages
    |
    v
initialize chat state
```

Handle corrupted/missing local data safely.

---

# 10. Settings Flow

```text
Settings
   |
   +--> Profile
   |      |
   |      v
   |   Form state
   |      |
   |      v
   |   Save
   |
   +--> Appearance
   |      |
   |      v
   |   Theme state
   |      |
   |      v
   |   localStorage
   |
   +--> Notifications
          |
          v
      preference state
          |
          v
      localStorage
```

---

# 11. Theme Flow

```text
User toggles theme
       |
       v
Theme state
       |
       v
DOM theme class/attribute
       |
       v
UI changes
       |
       v
localStorage
```

On reload:

```text
localStorage
     |
     v
theme initialization
     |
     v
application theme
```

---

# 12. Loading / Error / Empty State Flow

Every data-driven feature should follow:

```text
IDLE
 |
 v
LOADING
 |
 +-----> SUCCESS
 |
 +-----> ERROR
 |
 +-----> EMPTY
```

Not every operation requires all four states, but every relevant state must be intentionally handled.

---

# 13. Responsive Flow

### Desktop

```text
Sidebar + Header + Content
```

### Tablet

```text
Compact navigation + Content
```

### Mobile

```text
Header
Content
Bottom/mobile navigation
```

Content should reflow rather than overflow horizontally.

---

# 14. Animation Flow

Animations should correspond to user/system events:

```text
Page loads
   ↓
Entrance animation

List loads
   ↓
Staggered items

AI request
   ↓
Typing indicator

AI response
   ↓
Message entrance

Hover
   ↓
Micro-interaction

Theme change
   ↓
Theme transition
```

---

# 15. Complete User Journey

```text
User
 |
 v
Landing
 |
 | Get Started
 v
Dashboard
 |
 +--> "Who works in Engineering?"
 |         |
 |         v
 |     Assistant
 |         |
 |         v
 |      Answer
 |
 +--> Employees
 |         |
 |      Search/filter
 |
 +--> Analytics
 |         |
 |      View charts
 |
 +--> Settings
           |
        Update preferences
           |
           v
        Save locally
```
