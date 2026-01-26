# Service CLAUDE.md

Backend API service using Elysia framework with Bun runtime.

## Commands

```bash
bun run dev              # Start dev server (port 8000)
bun run dev:worker       # Start worker process
bun run build            # Build for production
bun run start            # Start production server
bun run test             # Run tests
bun run check-types      # Type check
```

## Architecture

The service follows Clean Architecture / Hexagonal Architecture principles.

### Directory Structure

```
src/
├── adapter/              # Infrastructure adapters (outside-in)
│   ├── auth/             # Better Auth configuration and adapters
│   ├── billing/          # Polar billing adapter
│   ├── email/            # Resend email adapter
│   ├── http/             # HTTP routers (Elysia routes)
│   └── repository/       # Database repositories (MongoDB implementations)
├── app/                  # Application layer
│   └── use-case/         # Business use cases
├── common/               # Shared utilities
│   ├── config/           # Application configuration
│   ├── ctx/              # Context types (MongoCtx, TenantCtx)
│   ├── domain/           # Base domain primitives (Entity, EntityId)
│   ├── err/              # Error handling (Err class, error codes)
│   ├── http/             # HTTP plugins (auth guard, envelope, error handler)
│   ├── mongo/            # MongoDB client and model utilities
│   └── schema/           # Shared schema utilities (codecs, Result schema)
├── di/                   # Dependency injection wiring
└── domain/               # Domain layer
    ├── entity/           # Domain entities
    └── port/             # Ports/interfaces (repository & use case contracts)
```

### Layer Responsibilities

**Domain Layer** (`domain/`)
- Entities: Rich domain objects extending `Entity` or `TenantAwareEntity`
- Ports: Zod function schemas defining contracts for repositories and use cases

**Application Layer** (`app/`)
- Use cases: Business logic orchestrating domain entities and repositories
- Factory functions (`make*UseCase`) accept repository dependencies

**Adapter Layer** (`adapter/`)
- HTTP: Elysia routers with DTOs, receive use cases as dependencies
- Repository: MongoDB implementations of port interfaces
- Auth: Better Auth configuration and session adapters
- Email: Resend email service for OTP and invitations
- Billing: Polar.sh subscription management

**DI Layer** (`di/`)
- Wires together repositories → use cases → routers

### Entity Pattern

Entities extend base classes from `common/domain/`:

```typescript
import { TenantAwareEntity } from "@/common/domain/tenant-aware-entity";
import { newEntityId } from "@/common/domain/entity-id";

export class DocumentEntity extends TenantAwareEntity<DocumentEntityProps> {
  static makeNew(tenantId: string, props: DocumentEntityProps) {
    return ok(new DocumentEntity(newEntityId(), tenantId, props));
  }

  static makeExisting(id, createdAt, updatedAt, tenantId, props) {
    return ok(new DocumentEntity(id, tenantId, props, { createdAt, updatedAt }));
  }
}
```

### Port Pattern (Contracts)

Use Zod function schemas to define typed contracts:

```typescript
import z from "zod";
import { makeResultSchema } from "@/common/schema/result-schema";

export const insertDocumentRepositorySchema = z.function({
  input: [z.object({ ctx: repositoryCtxSchema, data: z.instanceof(DocumentEntity) })],
  output: z.promise(makeResultSchema(z.void(), z.instanceof(Err))),
});
export type InsertDocumentRepository = z.output<typeof insertDocumentRepositorySchema>;
```

### Context Pattern

Contexts are passed through layers:

- `MongoCtx`: Contains `mongoDb` and `mongoClientSession`
- `TenantCtx`: Contains `tenantId` for multi-tenant isolation

```typescript
const repositoryCtxSchema = z.object({
  ...mongoCtxSchema.shape,
  ...tenantCtxSchema.shape,
});
```

### Error Handling

Use `Err` class with predefined codes:

```typescript
import { Err } from "@/common/err/err";
return err(Err.code("notFound"));
return err(Err.code("unauthorized", { message: "Custom message" }));
```

Available codes: `unknown`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `badRequest`, `selfVote`, `promptArchived`

### HTTP Responses

Wrap responses in envelope format:

```typescript
import { okEnvelope, errEnvelope } from "@/common/http/http-envelope";
return okEnvelope({ data: result });
return errEnvelope(Err.code("notFound"));
```

### Authentication (Better Auth)

Uses **Better Auth** with email OTP and organization plugins. Configuration at `adapter/auth/better-auth.ts`.

**Auth Guard Plugin** (`makeHttpAuthGuardPlugin()`) provides:
- `organizationId`: Tenant identifier from session (used as `tenantId`)
- `user`: Current user object with `id`, `email`, `firstName`, `lastName`, `organizationRole`

**Organization Roles:**
- `org:admin` - Maps from Better Auth `owner` or `admin` roles
- `org:member` - Maps from Better Auth `member` role

**Session Flow:**
1. User signs in via email OTP
2. Better Auth creates session, sets HttpOnly cookie
3. Auth guard extracts session from request headers
4. `getSession()` validates session with Better Auth
5. `getActiveMember()` fetches organization membership
6. User and organizationId injected into route context

**Key Files:**
- `adapter/auth/better-auth.ts` - Better Auth configuration
- `adapter/auth/better-auth-adapter.ts` - Session/member adapters
- `common/http/http-auth-guard-plugin.ts` - Auth middleware
- `adapter/email/resend-email-adapter.ts` - OTP email sending

### Database (MongoDB)

Uses MongoDB 8 with native driver. Collections:

**Application Collections:**
- `document` - User documents

**Better Auth Collections (auto-managed):**
- `user`, `session`, `account`, `verification`
- `organization`, `member`, `invitation`

**Patterns:**
- Collections accessed via factory functions in `adapter/repository/*/`
- Models convert between entities and MongoDB documents using `tenantAwareEntityToMongoModel()`
- IDs are ULIDs generated via `newEntityId()` from `@/common/domain/entity-id`
- All queries filter by `tenantId` for multi-tenant isolation
- HTTP requests wrapped in MongoDB transactions via `makeHttpMongoCtxPlugin()`

### External Services

**Email (Resend):**
- `makeSendOTPEmail()` - Send OTP codes for sign-in, verification
- `makeSendInvitationEmail()` - Send organization invitations

**Billing (Polar):**
- `makeCreateCheckoutSession()` - Create payment checkout
- `makeGetUserSubscription()` - Get active subscription
- `makeCancelSubscription()` - Cancel subscription

## Key Libraries

- `elysia` - Web framework
- `better-auth` - Authentication with email OTP and organizations
- `mongodb` - MongoDB native driver
- `zod/v4` - Schema validation (note the `/v4` import)
- `neverthrow` - Result types for error handling (`ok`, `err`, `Result`, `ResultAsync`)
- `resend` - Email service
- `@polar-sh/sdk` - Billing/subscriptions
- `inngest` - Background job processing
- `es-toolkit` - Utility functions
- `ulid` - ULID generation for entity IDs
- `pino` - Logging
