# Web (Frontend) Architecture

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

## Directory Structure

- `src/app/` - Next.js app router pages
- `src/component/ui/` - Shadcn UI components
- `src/component/platform/` - Platform-specific layout components
- `src/component/extended-ui/` - Custom UI extensions
- `src/lib/` - Utilities (config, http client, query helpers)
- `src/hook/` - React hooks
- `src/module/` - Feature modules

## Authentication

Uses Clerk with `@clerk/nextjs`. Auth routes:

- `/sign-in`
- `/sign-up`
- `/sign-out`
- `/platform` - Authenticated platform pages

## Configuration

Global config accessed via `globalConfig` from `@/lib/global-config.ts`:

- `globalConfig.app.env` - Environment (production/staging)
- `globalConfig.app.version` - App version
- `globalConfig.service.baseUrl` - Backend API URL

## Key Libraries

- `next` - Framework
- `react` / `react-dom` - React 19
- `@clerk/nextjs` - Authentication
- `@tanstack/react-query` - Data fetching
- `tailwindcss` v4 - Styling
- `shadcn/ui` - UI components
- `zod` - Schema validation
- `lucide-react` - Icons
