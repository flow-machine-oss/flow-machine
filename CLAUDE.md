# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flow Machine is an AI Software Engineer platform. This is a Turborepo monorepo with two main applications and shared packages.

## Development Commands

```bash
# Install dependencies
bun install

# Run all apps in development mode
bun run dev

# Type checking
bun run check-types

# Linting and formatting
bun run lint
bun run format

# Testing
bun run test

# Start PostgreSQL (required for local development)
docker compose up -d

# Run command on a specific app (use --filter from project root)
bun run check-types --filter ./app/service
bun run lint --filter ./app/web

# Run command on all apps
bun run check-types --filter "./app/*"
```

## Monorepo Structure

- `app/service` - Elysia backend API. See [app/service/CLAUDE.md](app/service/CLAUDE.md)
- `app/web` - Next.js frontend. See [app/web/CLAUDE.md](app/web/CLAUDE.md)
- `package/eslint-config` - Shared ESLint configuration
- `package/typescript-config` - Shared TypeScript configuration

## Import Aliases

Both apps use `@/` as the import alias for their `src/` directory.

## Environment Variables

All environment variables have to be defined in `turbo.json` globalEnv:

- `APP_ENV`, `APP_VERSION`
- `CLERK_ISSUER`, `CLERK_JWKS_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `DATABASE_URL`, `DATABASE_NAME`
- `DAYTONA_API_KEY`
- `INNGEST_DEV`, `INNGEST_BASE_URL`

## Code Style

- Import order: third-party modules, then `@/` aliases, then relative imports (enforced by prettier plugin)
- Use `es-toolkit` for utility functions
- Use `zod` for schema validation
- Use `neverthrow` for Result types in error handling
