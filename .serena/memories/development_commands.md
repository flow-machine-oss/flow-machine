# Development Commands

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
