# Web CLAUDE.md

Next.js 16 frontend application with React 19 and App Router.

## Commands

```bash
bun run dev              # Start dev server (port 3000)
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint
bun run check-types      # Type check
bun run shadcn:add       # Add shadcn/ui components
```

## Architecture

Layered hexagonal architecture with four distinct layers: domain, backend, frontend, and shared lib.

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── auth/[path]/              # Better Auth views (sign-in, sign-up, etc.)
│   ├── account/[path]/           # Account management views
│   ├── organization/[path]/      # Organization management views
│   ├── api/auth/[...all]/        # Auth API proxy to backend service
│   ├── api/v1/[feature]/         # API route handlers (proxy to backend)
│   ├── platform/                 # Authenticated platform area
│   │   └── [feature]/            # Feature pages (list, new, [id])
│   └── health/                   # Health check endpoint
├── domain/                       # Domain layer (pure, no framework deps)
│   ├── entity/[feature]/         # Domain schemas + domain services
│   │   ├── *-domain-schema.ts    # Zod schemas for domain models
│   │   └── *-domain-service.ts   # Formatting, display logic
│   └── port/[feature]/           # Port interfaces (input schemas)
│       └── *-service-port.ts     # Validated input schemas for operations
├── backend/                      # Backend integration layer (server-side)
│   ├── di.ts                     # Dependency injection (wires clients → handlers)
│   ├── http-client/[feature]/    # HTTP clients to upstream service
│   │   ├── *-http-client.ts      # API calls with response parsing
│   │   └── *-http-client-dto.ts  # Request/response DTO schemas
│   └── http-route-handler/[feature]/ # Next.js API route handlers
│       ├── *-route-handler.ts    # Request handling, validation, codec
│       └── *-route-handler-codec.ts  # Zod codec (DTO ↔ domain transform)
├── frontend/                     # Client-side code
│   ├── component/
│   │   ├── ui/                   # shadcn/ui components (50+)
│   │   ├── extended-ui/          # Custom extensions (DataTable, JsonEditorTextarea, etc.)
│   │   ├── platform/             # Platform layout (sidebar, page template)
│   │   └── global-provider.tsx   # Global providers (Auth, Query)
│   ├── feature/[feature-name]/   # Feature modules (pages + forms)
│   ├── hook/                     # React hooks
│   │   ├── [feature]/            # CRUD hooks (useList*, useGet*, useCreate*, etc.)
│   │   ├── use-protected-http-client.ts
│   │   ├── use-unprotected-http-client.ts
│   │   ├── use-confirmable-action.ts
│   │   └── use-json-editor.ts
│   ├── http-client/[feature]/    # Frontend HTTP clients (calls /api/v1/*)
│   │   └── *-http-client.ts      # Client-side API calls with Zod parsing
│   └── lib/
│       ├── auth/auth-client.ts   # Better Auth client configuration
│       ├── query/query-client.ts # TanStack Query client
│       ├── query/query-key.ts    # Query key factory functions
│       └── util.ts               # cn() helper
└── lib/                          # Shared utilities
    ├── config.ts                 # App configuration (env, version, baseUrl)
    └── http/
        ├── http-client.ts        # HttpClient type (axios)
        └── http-schema.ts        # HttpEnvelope schema
```

### Authentication (Better Auth)

Uses **Better Auth** with `better-auth` and `@daveyplate/better-auth-ui`.

**Auth Client** (`frontend/lib/auth/auth-client.ts`):
```typescript
export const authClient = createAuthClient({
  baseURL: config.service.baseUrl + "/api/auth",
  plugins: [emailOTPClient(), organizationClient()],
});
```

**Auth Routes:**
- `/auth/[path]` - Sign in, sign up, forgot password (dynamic routes)
- `/account/[path]` - Account settings, profile management
- `/organization/[path]` - Create org, invite members, manage roles
- `/api/auth/[...all]` - Auth API proxy to backend service

**Protected Routes:**
- `/platform/*` - Wrapped in `<SignedIn>` component via `PlatformLayout`

**UI Components:**
- `<SignedIn>` - Only renders children if authenticated
- `<SignedOut>` - Only renders if not authenticated
- `<UserButton>` - User profile dropdown
- `<OrganizationSwitcher>` - Switch between organizations

### Data Flow Pattern

Four-layer architecture for API features. Using `ai-agent` as the convention example:

**1. Domain Schemas & Ports** (`domain/`)
```typescript
// domain/entity/ai-agent/ai-agent-domain-schema.ts
export const aiAgentDomainSchema = z.object({
  ...tenantAwareBaseDomainSchema.shape,
  model: z.enum(aiModels),
  name: z.string(),
});

// domain/port/ai-agent/ai-agent-service-port.ts
export const createAiAgentServicePortInSchema = z.object({
  body: z.object({
    model: aiAgentDomainSchema.shape.model,
    name: aiAgentDomainSchema.shape.name,
  }),
});
```

**2. Frontend HTTP Client** (`frontend/http-client/`)
```typescript
// frontend/http-client/ai-agent/ai-agent-http-client.ts
export const makeAiAgentHttpClient = ({ httpClient }: { httpClient: HttpClient }) => ({
  list: async () => {
    const response = await httpClient.get(BASE_PATH);
    const schema = withHttpEnvelopeSchema(aiAgentDomainSchema.array());
    return schema.parse(response.data);
  },
  // create, getById, deleteById, updateById...
});
```

**3. React Hooks** (`frontend/hook/`)
```typescript
// frontend/hook/ai-agent/use-list-ai-agents.ts
export const useListAiAgents = (options?: UseListAiAgentsOptions) => {
  const httpClient = useProtectedHttpClient();
  return useQuery({
    queryKey: makeListAiAgentsQueryKey(),
    queryFn: () => makeAiAgentHttpClient({ httpClient }).list(),
    select: (envelope) => envelope.data,
    ...options,
  });
};
```

**4. Feature Components** (`frontend/feature/`)
```
frontend/feature/ai-agents-table/
├── ai-agents-table-column-def.tsx   # Column definitions with domain service
└── ai-agents-table-page.tsx         # Table page component

frontend/feature/new-ai-agent/
├── new-ai-agent-form-schema.ts      # Form validation schema
├── new-ai-agent-form.tsx            # Form component
├── new-ai-agent-page.tsx            # Page component
└── use-new-ai-agent-form.ts         # Form hook (react-hook-form)

frontend/feature/editable-ai-agent-details/
├── edit-ai-agent-form-schema.ts     # Edit form schema
├── edit-ai-agent-form.tsx           # Edit form component
├── editable-ai-agent-details.tsx    # Details with edit toggle
├── editable-ai-agent-details-page.tsx
└── use-edit-ai-agent-form.ts        # Edit form hook
```

**HTTP Clients:**
- `useProtectedHttpClient()` - axios with `withCredentials: true` for authenticated requests
- `useUnprotectedHttpClient()` - axios without credentials for public endpoints

### Backend Integration (Server-Side)

The `backend/` layer handles server-side proxying from Next.js API routes to the upstream service.

**HTTP Clients** (`backend/http-client/`): Call upstream service with DTO schemas for request/response validation.

**Route Handlers** (`backend/http-route-handler/`): Next.js API route handlers that validate input with port schemas, call backend HTTP clients, and transform responses using Zod codecs.

**Codecs** (`*-route-handler-codec.ts`): Transform between backend DTOs and domain models using `z.codec()`:
```typescript
export const aiAgentDomainCodec = z.codec(
  aiAgentHttpResponseDtoSchema,
  aiAgentDomainSchema,
  { decode: (dto) => ({ id: dto.id, ... }), encode: noop as () => never },
);
```

**DI** (`backend/di.ts`): Wires backend HTTP clients (with `defaultHttpClient`) into route handlers. API routes import from `di.ts`:
```typescript
// app/api/v1/ai-agent/route.ts
import { aiAgentRouteHandler } from "@/backend/di";
export const GET = aiAgentRouteHandler.list;
export const POST = aiAgentRouteHandler.create;
```

### Domain Services

Domain services encapsulate formatting and display logic. They are factory functions that take a domain entity:

```typescript
// domain/entity/ai-agent/ai-agent-domain-service.ts
export const makeAiAgentDomainService = ({ aiAgent }: { aiAgent: AiAgentDomain }) => ({
  getModelDisplayName: () => modelToDisplayName[aiAgent.model],
  getCreatedAt: () => format(aiAgent.createdAt, "MMM d, yyyy, h:mm a"),
});
```

Used in table column definitions and detail views to keep presentation logic out of components.

### Form Hooks

Forms use `react-hook-form` with `@hookform/resolvers/standard-schema` (formerly `@standard-schema/resolver`) and Zod schemas:

```typescript
export const useNewAiAgentForm = (props?: UseFormProps<NewAiAgentFormValues>) => {
  return useForm<NewAiAgentFormValues>({
    defaultValues: { name: "", model: "anthropic/claude-opus-4.5" },
    resolver: standardSchemaResolver(newAiAgentFormValuesSchema),
    ...props,
  });
};
```

### Confirmable Actions

The `useConfirmableAction` hook manages two-step confirm flows (e.g., delete). It tracks `idle → confirmation → inProgress` states and provides `withConfirmableAction`, `triggerAction`, and `resetAction` helpers.

### Query Key Factories

All query keys are defined as factory functions in `frontend/lib/query/query-key.ts`:

```typescript
export const makeListAiAgentsQueryKey = () => ["ai-agent"];
export const makeGetAiAgentQueryKey = (id: string) => ["ai-agent", id];
```

Mutation hooks invalidate related queries via these factories on success.

### Configuration

Config accessed via `config` from `@/lib/config.ts`:

```typescript
config.app.env       // Environment (production/staging)
config.app.version   // App version
config.service.baseUrl // Backend API URL
```

### Platform Sidebar Navigation

Navigation organized into sections:
- **Personal:** Inbox
- **Platform:** Project, Issue, Workflow, Execution, Document
- **Integration:** AI Agent, Git Repository, Credential
- **Support:** Billing, Feedback

### Styling

- **Tailwind CSS v4** with OKLCH color space
- **shadcn/ui** components (50+ pre-built)
- **Dark mode** via CSS class (`.dark`)
- Theme variables in `global.css`

## Key Libraries

- `next` - Framework (v16)
- `react` / `react-dom` - React 19
- `better-auth` - Authentication client
- `@daveyplate/better-auth-ui` - Pre-built auth UI components
- `@tanstack/react-query` - Data fetching and caching
- `@tanstack/react-table` - Table component (used by DataTable)
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Standard schema resolver for react-hook-form
- `axios` - HTTP client
- `tailwindcss` v4 - Styling
- `shadcn/ui` - UI component library
- `zod` v4 - Schema validation (imported as `zod/v4`)
- `date-fns` - Date formatting (used in domain services)
- `es-toolkit` - Utility functions
- `lucide-react` - Icons
- `recharts` - Charts
- `sonner` - Toast notifications
