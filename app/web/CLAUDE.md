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

### Directory Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── auth/[path]/      # Better Auth views (sign-in, sign-up, etc.)
│   ├── account/[path]/   # Account management views
│   ├── organization/[path]/ # Organization management views
│   ├── api/auth/[...all]/ # Auth API proxy to backend
│   ├── platform/         # Authenticated platform area
│   └── health/           # Health check endpoint
├── component/
│   ├── ui/               # Shadcn UI components (52+ components)
│   ├── platform/         # Platform layout (sidebar, page template)
│   ├── extended-ui/      # Custom UI extensions (Center, Pending, Logo)
│   └── global-provider.tsx # Global providers (Auth, Query)
├── hook/                 # React hooks
│   └── [feature]/        # Feature-specific hooks (CRUD operations)
├── service/              # API service layer
│   └── [feature]/        # Feature-specific API services
├── schema/               # Zod schemas for DTOs
│   └── [feature]/        # Feature-specific schemas
└── lib/                  # Utilities
    ├── auth-client.ts    # Better Auth client configuration
    ├── config.ts         # App configuration
    ├── http/             # HTTP client and DTOs
    └── query/            # TanStack Query client and keys
```

### Authentication (Better Auth)

Uses **Better Auth** with `better-auth` and `@daveyplate/better-auth-ui`.

**Auth Client** (`lib/auth-client.ts`):
```typescript
export const authClient = createAuthClient({
  baseURL: config.service.baseUrl + "/api/auth",
  fetchOptions: { credentials: "include" }, // Required for cross-origin cookies
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

Three-layer architecture for API features:

**1. Hooks** (`hook/[feature]/`)
```typescript
export const useListAiAgents = () => {
  const httpClient = useProtectedHttpClient();
  return useQuery({
    queryKey: makeListAiAgentsQueryKey(),
    queryFn: makeListAiAgents(httpClient),
  });
};
```

**2. Services** (`service/[feature]/`)
```typescript
export const makeListAiAgents = (httpClient: HttpClient) => async () => {
  const response = await httpClient.get<HttpEnvelope<AiAgentResponseDto[]>>("/api/v1/ai-agent");
  return response.data.data;
};
```

**3. Schemas** (`schema/[feature]/`)
```typescript
export const aiAgentResponseDtoSchema = z.object({
  ...organizationAwareBaseDtoSchema.shape,
  model: z.enum(aiAgentModels),
  name: z.string(),
});
```

**HTTP Clients:**
- `useProtectedHttpClient()` - With credentials (cookies) for authenticated requests
- `useUnprotectedHttpClient()` - Without credentials for public endpoints

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
- **shadcn/ui** components (52+ pre-built)
- **Dark mode** via CSS class (`.dark`)
- Theme variables in `global.css`

## Key Libraries

- `next` - Framework (v16)
- `react` / `react-dom` - React 19
- `better-auth` - Authentication client
- `@daveyplate/better-auth-ui` - Pre-built auth UI components
- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `tailwindcss` v4 - Styling
- `shadcn/ui` - UI component library
- `zod` - Schema validation
- `lucide-react` - Icons
- `recharts` - Charts
- `sonner` - Toast notifications
