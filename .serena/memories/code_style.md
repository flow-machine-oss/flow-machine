# Code Style and Conventions

## Imports

- **Import order**: third-party modules, then `@/` aliases, then relative imports (enforced by prettier plugin)

## Libraries

- **Utilities**: Use `es-toolkit` for utility functions
- **Schema validation**: Use `zod` v4 — imported as `zod/v4` in service, `zod/v4` in web
- **Error handling**: Use `neverthrow` for Result types (`ok`, `err`, `Result`, `ResultAsync`) throughout service layer

## Entity IDs

- IDs are **UUIDv7** generated via `newEntityId()` which calls Bun's `randomUUIDv7()`
- Defined in `app/service/src/common/domain/entity-id.ts`

## Multi-Tenancy

- Entities extend `TenantAwareEntity` with a `tenantId` field
- All repository queries filter by `tenantId` for tenant isolation
- `tenantId` comes from the user's active organization (`organizationId`)

## HTTP Envelope Pattern

- API responses wrapped in envelope format: `okEnvelope({ data: result })` / `errEnvelope(Err.code("notFound"))`
- Frontend parses with `withHttpEnvelopeSchema()` and selects `.data` in hooks

## Forms (Web)

- `react-hook-form` + `@hookform/resolvers/standard-schema` + Zod schemas
- Form hooks: `useNewXForm()` / `useEditXForm()` factory pattern
- Form schemas: separate `*-form-schema.ts` files

## Domain Services (Web)

- Factory functions for display/formatting logic: `makeXDomainService({ entity })`
- Used in table column definitions and detail views
- Keep presentation logic out of components
