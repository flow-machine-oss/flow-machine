# Code Style and Conventions

## Imports

- **Import order**: third-party modules, then `@/` aliases, then relative imports (enforced by prettier plugin)
- **Zod import**: `import z from "zod"` in most files; `import { z } from "zod/v4"` in config.ts (inconsistency)

## Libraries

- **Utilities**: `es-toolkit` (merge, omitBy, isNil, etc.)
- **Schema validation**: `zod` v4
- **Error handling**: `neverthrow` (`ok`, `err`, `Result`) — imperative propagation style
- **Dates**: `@date-fns/utc` (`UTCDate`) for UTC-safe date handling
- **Type safety**: `@total-typescript/ts-reset` via `src/reset.d.ts`

## Entity Pattern

All domain entities in `core/domain/`:
- Extend `Entity<T>` or `TenantAwareEntity<T>` from `common/domain/`
- Static factory: `makeNew(tenant, props)` for creation, `makeExisting(...)` for rehydration
- `update(partial)` uses `es-toolkit/merge` for deep merge + bumps `updatedAt`
- IDs are UUIDv7 via `newEntityId()` (Bun's `randomUUIDv7()`)
- Private `#` fields for encapsulation

## Multi-Tenancy

- Entities extend `TenantAwareEntity` with `tenant: { id: EntityId, type: "organization" | "user" }`
- All repository queries filter by `{ tenant: ctx.tenant }` for isolation
- `tenantId` comes from user's active organization or user's own ID

## Port/Contract Pattern

Core ports (interfaces) co-located with Zod input schema objects:
```typescript
const xCrudServiceInputSchema = {
  create: z.object({ ctx: ctxSchema, payload: z.object({...}) }),
  ...
};
interface XCrudService {
  create(input: z.infer<typeof xCrudServiceInputSchema.create>): Promise<Result<T, Err>>;
}
```

## Service Implementation Pattern (BasicCrudService)

All app-layer services follow identical template:
- Constructor injection of repository interface (core port)
- `#` private fields for all dependencies
- `create` → `Entity.makeNew()` → `repository.insert()`
- `get` → `repository.findOne()` → null→notFound check → `ok(entity)`
- `update` → read-then-write: findOne → `entity.update(partial)` → `repository.update()`
- `delete` → pass-through (no notFound check)
- `list` → pass-through to `repository.findMany()`

## HTTP Response Pattern

Envelope: `{ status, code, message, data? }` via `okEnvelope()` / `errEnvelope()`
- `okEnvelope({ data })` strips nil fields via `omitBy(isNil)`
- `errEnvelope(err)` returns `{ status, code, message }` — no data

## DTO Pattern

Each API module has `http-dto.ts`:
- Request body schemas derived from core input schemas (reusing .shape fields)
- PATCH schemas add `.optional()` to each field
- Response types via `z.output<>` used as TypeScript `satisfies` assertions
- Params schemas for `:id` routes use `entityIdSchema`

## DI Pattern

Manual constructor injection in `di/*.ts`:
- Module-level singletons (instantiated at import time)
- `di/shared.ts` — shared auth/ctx factories
- Per-domain files wire: MongoCrudRepository → BasicCrudService → V1HttpRouterFactory
- No IoC container, no decorators

## Error Handling Style

```typescript
// Creating errors
Err.code("notFound")
Err.code("unauthorized", { message: "Custom" })
Err.from(unknownError)  // normalizes any thrown value

// Propagating Results (imperative style, NOT neverthrow chaining)
if (result.isErr()) return err(result.error);
const value = result.value;
```

## MongoDB Repository Pattern

All 6 repos structurally identical:
- `#getCollection(ctx)` → gets collection (currently calls createIndexes each time)
- `#toDomain(model)` → `Entity.makeExisting(...)` with field mapping
- Write: `tenantAwareEntityToMongoModel(entity)` → `insertOne`/`replaceOne`
- Read: `findOne`/`find` with `{ tenant: ctx.tenant }` filter
- All ops pass `mongoClientSession` for transaction support

## Elysia Router Pattern

Each router is a factory class (`*HttpRouterFactory`):
- Constructor receives auth guard, ctx factory, and service(s)
- `.make()` returns an Elysia plugin
- Uses scoped plugins: `httpRequestCtxFactory.make()` + `httpAuthGuardFactory.make()`
- Route groups under `/api/v1/<resource>`
- Body/params validated by Zod schemas

## Forms (Web)

- `react-hook-form` + `@hookform/resolvers/standard-schema` + Zod schemas
- Form hooks: `useNewXForm()` / `useEditXForm()` factory pattern
- Form schemas: separate `*-form-schema.ts` files

## Domain Services (Web)

- Factory functions for display/formatting logic: `makeXDomainService({ entity })`
- Used in table column definitions and detail views
- Keep presentation logic out of components
