# Module 1: Memory System — CLAUDE.md

## Overview

In this module, you'll learn how to give Claude a permanent memory using CLAUDE.md.

## The Project: order-service

A Node.js + TypeScript + Fastify microservice for managing orders. This project uses:
- **Fastify** (not Express) for the HTTP framework
- **Prisma** for database access
- **pnpm** as the package manager
- **TypeScript** with strict mode
- Layered architecture: routes → services → repos

## Exercises

### Exercise 1: See the Problem (2 min)

1. Open a terminal in `01-memory/order-service/`
2. Start Claude Code: `claude`
3. Ask: `"What framework does this project use?"`
4. Notice: Claude may guess Express (wrong!) because that's the internet default
5. Ask: `"Add a new endpoint for getting order statistics"`
6. Notice: Claude may put business logic directly in the route handler (violating our architecture)

### Exercise 2: Auto-Generate CLAUDE.md (3 min)

1. In Claude Code, run: `/init`
2. Claude scans your project and generates `CLAUDE.md`
3. Compare what was generated with `CLAUDE.md.init` (our reference)
4. Notice: `/init` captures the WHAT (tech stack, commands) but misses the WHY

### Exercise 3: Add Hidden Knowledge (5 min)

1. Open `CLAUDE.md` in your editor
2. Add the architecture decisions and coding standards
3. Reference `CLAUDE.md.enhanced` for the complete version
4. Key additions:
   - **Why Fastify over Express** (prevents wrong framework suggestions)
   - **Layered architecture rules** (prevents mixing concerns)
   - **Coding standards** (interface vs type, no `any`)

### Exercise 4: Test Your Memory (3 min)

1. Start a NEW Claude Code session: `claude`
2. Ask the same questions from Exercise 1
3. Notice the difference — Claude now knows your architecture!

## Reference Files

- `CLAUDE.md.init` — What `/init` typically generates (auto-detected info only)
- `CLAUDE.md.enhanced` — The complete version with hidden knowledge added
