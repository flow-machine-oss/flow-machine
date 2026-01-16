# Project Overview

Flow Machine is an AI Software Engineer platform. This is a Turborepo monorepo with two main applications and shared packages.

## Monorepo Structure

- `app/service` - Elysia backend API (see app/service/CLAUDE.md for details)
- `app/web` - Next.js frontend (see app/web/CLAUDE.md for details)
- `package/eslint-config` - Shared ESLint configuration
- `package/typescript-config` - Shared TypeScript configuration

## Import Aliases

Both apps use `@/` as the import alias for their `src/` directory.

## Environment Variables

All environment variables must be defined in `turbo.json` globalEnv:

- `APP_ENV`, `APP_VERSION`
- `CLERK_ISSUER`, `CLERK_JWKS_URL`
- `DATABASE_URL`
