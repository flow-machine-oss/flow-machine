# PRD: Inngest Workflow Kit Integration

**Author:** [Author Name]
**Status:** Draft
**Last Updated:** 2026-01-17

---

## 1. Overview

Flow Machine is an AI Software Engineer platform. To enable end users to create customizable agentic workflows, we will integrate [Inngest Workflow Kit](https://www.inngest.com/docs/reference/workflow-kit) - a framework that combines a backend Workflow Engine with pre-built React components for visual workflow editing.

### Problem Statement

Users need the ability to define and execute multi-step agentic workflows that can:
- Chain multiple AI agent tasks together
- Include human-in-the-loop approval steps
- Run automated pipelines triggered by events

Currently, there is no infrastructure to support user-defined workflows in Flow Machine.

### Solution Summary

Integrate Inngest Workflow Kit to provide:
- **Workflow Engine**: Execute user-defined workflows reliably with automatic retries
- **Workflow Editor UI**: Pre-built React components for visual workflow creation

### MVP Scope

For the initial release, we will implement:
- Basic Inngest integration with the Workflow Engine
- 5 **stub actions** (console.log only) to validate the architecture
- Dedicated workflows page with the Workflow Kit editor
- Manual workflow trigger via "Run" button (for testing only)

---

## 2. Goals & Non-Goals

### Goals

1. **Provide a visual workflow editor** for composing workflow actions using Inngest Workflow Kit React components
2. **Execute workflows reliably** with Inngest's automatic retries and error handling
3. **Validate the architecture** with stub actions (console.log) before investing in real AI agent integration

### Non-Goals (MVP)

- End-to-end user-facing workflow creation (MVP is architecture validation)
- Event-driven workflow triggers via webhooks
- Persistent workflow storage in database
- Workflow execution visibility (logs, run history in UI)
- Real AI agent actions (ECS sandbox + Claude Code)
- Scheduled/cron-based workflow triggers
- Organization or project-level workflow scoping
- Workflow versioning or rollback
- Workflow templates or marketplace
- Complex branching/conditional logic
- Real-time collaboration on workflow editing

---

## 3. Background

### What is Inngest Workflow Kit?

[Inngest Workflow Kit](https://www.inngest.com/docs/reference/workflow-kit) is a framework for building user-defined workflows. It provides:

| Component | Description |
|-----------|-------------|
| **Workflow Engine** | Backend execution engine that runs within Inngest Functions, managing action execution with automatic retries |
| **React Components** | Pre-built `<Provider>`, `<Editor>`, and `<Sidebar>` components for visual workflow editing |
| **Action System** | Two-part action definitions: `PublicEngineAction` (frontend) and `EngineAction` (backend with handlers) |
| **Workflow Instance** | JSON structure representing a user's workflow configuration, stored in database |

### Why Workflow Kit?

Building a workflow system from scratch requires:
- State machine implementation with BFS traversal
- Durable execution with retry logic
- Frontend workflow editor UI

Workflow Kit provides these out-of-the-box, allowing us to focus on defining actions specific to Flow Machine rather than infrastructure.

### Key Concepts

**Workflow Instance**: A JSON object containing:
- `name`, `description`: Metadata
- `actions[]`: Array of action steps with `id`, `kind`, `name`, `inputs`
- `edges[]`: Connections between actions (defines execution order)

**Workflow Actions**: Defined in two parts to separate frontend/backend concerns:
- `PublicEngineAction`: `kind`, `name`, `description`, `icon` (exposed to frontend)
- `EngineAction`: Extends public action with `handler` function (backend only)

**Workflow Engine**: Instantiated with actions and a `loader` function that retrieves workflow instances from the database based on incoming events.

---

## 4. Requirements

### Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | Install and configure Inngest SDK in the backend service | Must |
| FR-2 | Create Workflow Engine with loader function | Must |
| FR-3 | Define 5 stub actions with console.log handlers | Must |
| FR-4 | Integrate Workflow Kit React components in frontend | Must |
| FR-5 | Create `/workflows` page with Editor component | Must |
| FR-6 | Trigger workflow execution via Inngest Function | Must |

### Stub Actions (MVP)

The following stub actions will be implemented for architecture validation:

| Action Kind | Name | Description | Handler Behavior |
|-------------|------|-------------|------------------|
| `log_message` | Log Message | Logs a custom message | `console.log(inputs.message)` |
| `delay` | Delay | Waits for a specified duration | `console.log("Waiting...")` + sleep |
| `http_request` | HTTP Request (Stub) | Simulates an HTTP request | `console.log("Would call: " + inputs.url)` |
| `transform_data` | Transform Data (Stub) | Simulates data transformation | `console.log("Transforming: " + inputs.data)` |
| `notify` | Notify (Stub) | Simulates sending notification | `console.log("Notifying: " + inputs.channel)` |

### Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Workflow execution must be durable (survive restarts) | Provided by Inngest |
| NFR-2 | Failed actions must automatically retry | Up to 3 retries |
| NFR-3 | Workflow editor must load within 2 seconds | < 2s initial load |
| NFR-4 | Console logs must be visible in Inngest dashboard | 100% visibility |

---

## 5. Technical Design

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              /workflows page                             │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │  <Provider>                                      │    │    │
│  │  │    <Editor>                                      │    │    │
│  │  │      <Sidebar />                                 │    │    │
│  │  │    </Editor>                                     │    │    │
│  │  │  </Provider>                                     │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Workflow Instance (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Elysia + Inngest)                   │
│  ┌──────────────────┐    ┌──────────────────────────────────┐   │
│  │   Elysia API     │    │        Inngest Function          │   │
│  │                  │    │  ┌────────────────────────────┐  │   │
│  │ POST /workflows  │───▶│  │     Workflow Engine        │  │   │
│  │ GET /workflows   │    │  │                            │  │   │
│  │                  │    │  │  loader() → fetch from DB  │  │   │
│  └──────────────────┘    │  │  actions[] → stub handlers │  │   │
│                          │  └────────────────────────────┘  │   │
│                          └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
app/service/src/
├── inngest/
│   ├── client.ts              # Inngest client initialization
│   ├── functions/
│   │   └── workflow.fn.ts     # Workflow execution function
│   └── workflows/
│       ├── engine.ts          # Workflow Engine setup
│       ├── actions.ts         # Stub action definitions (public)
│       └── handlers.ts        # Action handlers (backend)

app/web/src/
├── app/workflows/
│   └── page.tsx               # Workflows page
├── components/workflow/
│   └── workflow-editor.tsx    # Editor wrapper component
```

### Backend Implementation

#### 1. Inngest Client Setup

```typescript
// app/service/src/inngest/client.ts
import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "flow-machine",
});
```

#### 1b. Elysia Integration

Inngest provides an Express-compatible serve handler. Since Elysia does not have native Inngest support, we use the `serve` function with a custom adapter:

```typescript
// app/service/src/inngest/serve.ts
import { serve } from "inngest/express";
import { inngest } from "./client";
import { runWorkflow } from "./functions/workflow.fn";

// Create the Inngest serve handler
export const inngestHandler = serve({
  client: inngest,
  functions: [runWorkflow],
});

// Elysia route adapter
// Note: If this approach doesn't work, fallback to Express middleware adapter
```

```typescript
// app/service/src/index.ts (or main app file)
import { Elysia } from "elysia";

const app = new Elysia()
  // ... other routes
  .post("/api/inngest", async ({ request }) => {
    // Forward to Inngest handler
    // Implementation depends on Elysia-Express compatibility
    // See: https://www.inngest.com/docs/sdk/serve
  })
  .get("/api/inngest", async ({ request }) => {
    // Inngest dev server introspection endpoint
  });
```

**Note:** Exact Elysia integration may require experimentation. If the above doesn't work, consider:
1. Running Inngest serve on a separate Express micro-service
2. Using Elysia's Express compatibility layer if available

#### 2. Action Definitions

```typescript
// app/service/src/inngest/workflows/actions.ts
import type { PublicEngineAction } from "@inngest/workflow-kit";

export const publicActions: PublicEngineAction[] = [
  {
    kind: "log_message",
    name: "Log Message",
    description: "Logs a custom message to console",
  },
  {
    kind: "delay",
    name: "Delay",
    description: "Waits for a specified duration",
  },
  // ... other stub actions
];
```

#### 3. Action Handlers

```typescript
// app/service/src/inngest/workflows/handlers.ts
import type { EngineAction } from "@inngest/workflow-kit";
import { publicActions } from "./actions";

export const actions: EngineAction[] = [
  {
    ...publicActions[0], // log_message
    handler: async ({ workflowAction }) => {
      console.log("[log_message]", workflowAction.inputs?.message);
      return { success: true };
    },
  },
  {
    ...publicActions[1], // delay
    handler: async ({ step, workflowAction }) => {
      const ms = workflowAction.inputs?.duration ?? 1000;
      console.log("[delay] Waiting for", ms, "ms");
      await step.sleep("delay", ms);
      return { success: true };
    },
  },
  // ... other handlers
];
```

#### 4. Workflow Engine

```typescript
// app/service/src/inngest/workflows/engine.ts
import { Engine } from "@inngest/workflow-kit";
import { actions } from "./handlers";

export const workflowEngine = new Engine({
  actions,
  loader: async (event) => {
    // For MVP: return a hardcoded workflow instance
    // Future: fetch from database using event.data.workflowId
    return event.data.workflow;
  },
});
```

#### 5. Inngest Function

```typescript
// app/service/src/inngest/functions/workflow.fn.ts
import { inngest } from "../client";
import { workflowEngine } from "../workflows/engine";

export const runWorkflow = inngest.createFunction(
  { id: "run-workflow" },
  { event: "workflow/run" },
  async ({ event, step }) => {
    const result = await workflowEngine.run({ event, step });
    return result;
  }
);
```

### Frontend Implementation

#### Workflow Editor Component

```typescript
// app/web/src/components/workflow/workflow-editor.tsx
"use client";

import { useState } from "react";
import { Editor, Provider, Sidebar } from "@inngest/workflow-kit/ui";
import type { Workflow } from "@inngest/workflow-kit";

interface WorkflowEditorProps {
  initialWorkflow: Workflow;
  availableActions: PublicEngineAction[];
  onSave: (workflow: Workflow) => void;
}

export function WorkflowEditor({
  initialWorkflow,
  availableActions,
  onSave,
}: WorkflowEditorProps) {
  const [workflow, setWorkflow] = useState(initialWorkflow);

  return (
    <Provider
      workflow={workflow}
      trigger={{ event: { name: "workflow/run" } }}
      availableActions={availableActions}
      onChange={setWorkflow}
    >
      <Editor>
        <Sidebar position="right" />
      </Editor>
    </Provider>
  );
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflows/actions` | Returns list of `PublicEngineAction[]` |
| POST | `/api/workflows/run` | Triggers workflow execution via Inngest |

### Dependencies

```json
{
  "dependencies": {
    "@inngest/workflow-kit": "^0.1.3",
    "inngest": "^3.x"
  }
}
```

---

## 6. UI/UX Design

### Workflows Page (`/workflows`)

For MVP, a minimal page to test the Workflow Kit editor:

```
┌──────────────────────────────────────────────────────────────────┐
│  Flow Machine                                    [User Menu]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Workflow Editor (MVP)                              [Run ▶]      │
│  ─────────────────────────────────────────────────────────────   │
│                                                                  │
│  ┌────────────────────────────────────┐  ┌──────────────────┐   │
│  │                                    │  │  Sidebar         │   │
│  │      Workflow Kit <Editor>         │  │                  │   │
│  │                                    │  │  Actions:        │   │
│  │   [Start] ──▶ [Log Message]        │  │  • Log Message   │   │
│  │                    │               │  │  • Delay         │   │
│  │                    ▼               │  │  • HTTP Request  │   │
│  │              [Delay]               │  │  • Transform     │   │
│  │                    │               │  │  • Notify        │   │
│  │                    ▼               │  │                  │   │
│  │              [End]                 │  │  Properties:     │   │
│  │                                    │  │  [Selected node] │   │
│  │                                    │  │                  │   │
│  └────────────────────────────────────┘  └──────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### User Flow

1. User navigates to `/workflows`
2. Workflow Kit Editor loads with available stub actions in sidebar
3. User drags actions onto canvas and connects them
4. User configures action inputs via sidebar properties panel
5. User clicks "Run" to trigger workflow execution
6. Console output visible in Inngest dashboard (external)

### UI Components

| Component | Source | Notes |
|-----------|--------|-------|
| Editor canvas | `@inngest/workflow-kit/ui` | Drag-and-drop workflow builder |
| Sidebar | `@inngest/workflow-kit/ui` | Actions list + properties panel |
| Run button | Custom | Triggers `POST /api/workflows/run` |

### Styling

The Workflow Kit provides default styling. For MVP, we'll use the default styles with minimal customization to match Flow Machine's design system.

---

## 7. Implementation Plan

### Milestones

#### Milestone 1: Backend Setup
- Install `inngest` and `@inngest/workflow-kit` dependencies
- Create Inngest client (`src/inngest/client.ts`)
- Configure Inngest serve endpoint in Elysia
- Verify Inngest dev server connection

#### Milestone 2: Stub Actions & Engine
- Define `PublicEngineAction[]` for 5 stub actions
- Implement `EngineAction[]` with console.log handlers
- Create Workflow Engine with loader
- Create `run-workflow` Inngest function

#### Milestone 3: Frontend Integration
- Install `@inngest/workflow-kit` in web app
- Create `/workflows` page
- Implement `WorkflowEditor` component with Provider/Editor/Sidebar
- Add "Run" button to trigger workflow

#### Milestone 4: End-to-End Testing
- Create test workflow in editor
- Trigger execution via API
- Verify console output in Inngest dashboard
- Document any issues or learnings

### Dependencies

| Dependency | Blocked By | Notes |
|------------|------------|-------|
| Milestone 2 | Milestone 1 | Engine requires Inngest client |
| Milestone 3 | Milestone 2 | Frontend needs action definitions |
| Milestone 4 | Milestone 3 | E2E requires full stack |

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Workflow Kit incompatibility with Elysia | High | Test early; fallback to Express adapter if needed |
| React components styling conflicts | Medium | Isolate in separate CSS scope |
| Inngest dev server setup complexity | Low | Follow official quick start guide |

### Future Phases (Post-MVP)

1. **Phase 2**: Database persistence for workflow instances
2. **Phase 3**: Event-driven triggers via webhooks
3. **Phase 4**: Real AI agent actions (ECS sandbox + Claude Code)
4. **Phase 5**: Workflow execution history and logs UI

---

## 8. Success Metrics

### MVP Success Criteria

Since MVP is focused on architecture validation, success is measured by technical milestones rather than user metrics:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Inngest integration works | ✓/✗ | Inngest dev server connects and receives events |
| Workflow Engine executes | ✓/✗ | `run-workflow` function completes without errors |
| All stub actions run | 5/5 | Each action logs expected output |
| Editor renders correctly | ✓/✗ | Workflow Kit components display and function |
| E2E flow completes | ✓/✗ | Workflow created in UI executes on backend |

### Definition of Done

MVP is complete when:
1. A developer can create a workflow using the editor UI
2. The workflow can be triggered via API call
3. All actions in the workflow execute and log to console
4. Logs are visible in Inngest dashboard

### Future Metrics (Post-MVP)

Once MVP is validated, subsequent phases will track:
- Workflow creation rate (workflows/week)
- Workflow execution success rate
- Average actions per workflow
- User adoption of workflow feature
