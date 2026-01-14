# Flow Machine

**Your AI Engineering Team**

> Deploy AI software engineers on-demand to pick up tasks directly from your
> team's backlog.

[![Status](https://img.shields.io/badge/status-early%20development-yellow)](https://github.com/flow-machine/flow-machine)

---

## What is Flow Machine?

Flow Machine is an AI Software Engineer platform that automates repetitive
engineering tasks and boosts developer productivity. Instead of waiting for
human engineers to become available, Flow Machine lets you spin up AI engineers
that can work through your backlog autonomously.

**Key benefits:**

- **On-demand AI engineers** - Scale your engineering capacity instantly
- **Backlog integration** - AI picks up tasks directly from your existing workflow
- **Developer productivity** - Free up your team to focus on high-impact work

## Features

- Automated task execution from team backlogs
- Intelligent code generation and modification
- Built on a modern TypeScript stack (Elysia + Next.js)

## Prerequisites

Before getting started, make sure you have:

- [Bun](https://bun.sh/) (v1.0 or later)
- [Docker](https://www.docker.com/) (for MongoDB)
- [Node.js](https://nodejs.org/) (v24 or later)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/flow-machine/flow-machine.git
   cd flow-machine
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Start MongoDB**

   ```bash
   docker compose up -d
   ```

4. **Run the development server**

   ```bash
   bun run dev
   ```

For detailed development commands, monorepo structure, and code style guidelines, see [CLAUDE.md](CLAUDE.md).

## Project Structure

This is a Turborepo monorepo with two main applications:

| Directory     | Description                                |
| ------------- | ------------------------------------------ |
| `app/service` | Elysia backend API                         |
| `app/web`     | Next.js frontend                           |
| `package/*`   | Shared configurations (ESLint, TypeScript) |

For more details on each app, see their respective `CLAUDE.md` files.

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun run test && bun run lint`)
5. Commit your changes
6. Push to your branch and open a Pull Request

Please ensure your code follows the style guidelines outlined in [CLAUDE.md](CLAUDE.md#code-style).

## License

This project is proprietary software. All rights reserved.

---

Built with [Turborepo](https://turbo.build/), [Elysia](https://elysiajs.com/), and [Next.js](https://nextjs.org/).
