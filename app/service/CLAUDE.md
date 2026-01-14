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

### Directory Structure

- `src/schema/` - Drizzle ORM table definitions (PostgreSQL)
- `src/lib/` - Core utilities (config, db, error handling, http responses)
- `src/guard/` - Authentication guards (Clerk JWT verification)
- `src/middleware/` - Elysia middleware (router setup with context)

### Context Pattern

Routes receive a `Ctx` object containing shared dependencies:

- `ctx.db` - Drizzle database client
- `ctx.config` - Validated application config
- `ctx.log` - Logger instance
- `ctx.guard` - Authentication guards

### Error Handling

Use `Err` class with predefined codes:

```typescript
import { Err } from "@/lib/err";
return Err.code("unauthorized");
return Err.code("notFound", { message: "Custom message" });
```

Available codes: `unknown`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `badRequest`, `selfVote`, `promptArchived`

### HTTP Responses

Wrap responses in envelope format:

```typescript
import { okEnvelope, errEnvelope } from "@/lib/http";
return okEnvelope({ data: result });
return errEnvelope(Err.code("notFound"));
```

### Database Schemas

Tables use shared column helpers from `shared.schema.ts`:

- `makeBaseSchemaTableColumns()` - id, createdAt, updatedAt
- `makeOrganizationAwareBaseSchemaTableColumns()` - adds organizationId
- `makeDefaultOrganizationAwareIndexes(table)` - standard org index

IDs are ULIDs generated via `newId()` from `@/lib/id`.

### Authentication

Clerk JWT tokens verified via JWKS endpoint. Use `authCheck` guard from `@/guard/auth-check.guard.ts`.

## Key Libraries

- `elysia` - Web framework
- `drizzle-orm` - Database ORM
- `zod/v4` - Schema validation (note the `/v4` import)
- `neverthrow` - Result types for error handling
- `jose` - JWT verification
