# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flow Machine is an AI Software Engineer platform. This is a Turborepo monorepo with two main applications and shared packages, built with Bun runtime.

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

# Start MongoDB and Inngest (required for local development)
docker compose up -d

# Run command on a specific app (use --filter from project root)
bun run check-types --filter ./app/service
bun run lint --filter ./app/web

# Run command on all apps
bun run check-types --filter "./app/*"
```

## Monorepo Structure

- `app/service` - Elysia backend API (port 8000). See [app/service/CLAUDE.md](app/service/CLAUDE.md)
- `app/web` - Next.js frontend (port 3000). See [app/web/CLAUDE.md](app/web/CLAUDE.md)
- `package/eslint-config` - Shared ESLint configuration (base + Next.js)
- `package/typescript-config` - Shared TypeScript configuration (base + Next.js)

## Import Aliases

Both apps use `@/` as the import alias for their `src/` directory.

## Environment Variables

All environment variables must be defined in `turbo.json` globalEnv:

**Application:**
- `APP_ENV` - Environment (production/staging)
- `APP_VERSION` - Version string

**Authentication (Better Auth):**
- `BETTER_AUTH_SECRET` - Secret for JWT signing
- `BETTER_AUTH_URL` - Backend URL (http://localhost:8000)
- `BETTER_AUTH_TRUSTED_ORIGINS` - Comma-separated trusted origins

**Database (MongoDB):**
- `DATABASE_URL` - MongoDB connection string
- `DATABASE_NAME` - Database name

**Third-party Services:**
- `DAYTONA_API_KEY` - Daytona SDK key
- `INNGEST_DEV`, `INNGEST_BASE_URL` - Inngest configuration
- `POLAR_ACCESS_TOKEN`, `POLAR_ENVIRONMENT` - Polar billing
- `RESEND_API_KEY`, `EMAIL_FROM_ADDRESS` - Email service

## Code Style

- Import order: third-party modules, then `@/` aliases, then relative imports (enforced by prettier plugin)
- Use `es-toolkit` for utility functions
- Use `zod` (v4) for schema validation
- Use `neverthrow` for Result types in error handling

## Authentication

Uses **Better Auth** (migrated from Clerk) with:
- Email OTP authentication (passwordless)
- Organization management for multi-tenancy
- Cookie-based sessions (HttpOnly, cross-origin supported)

## Database

Uses **MongoDB 8** with native driver (not Mongoose). Local development runs via Docker Compose.

## Key Technologies

- **Runtime:** Bun 1.3.5
- **Build:** Turborepo 2.7.2
- **Backend:** Elysia 1.4.x
- **Frontend:** Next.js 16, React 19
- **Styling:** Tailwind CSS v4, shadcn/ui
