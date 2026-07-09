---
name: api-generating
description: >
  Generate REST API endpoints following project conventions.
  Activate when user asks to create a new API endpoint, add a route,
  or build a new API resource with CRUD operations.
allowed-tools:
  - Read
  - Edit
  - Write
  - Bash
  - Grep
  - Glob
---

# API Endpoint Generator

Generate REST API endpoints following the project's established patterns.

## Before Generating

1. Read existing route files to understand the project's patterns
2. Check for validation library usage (Zod, Joi, etc.)
3. Identify the architecture pattern (layered, MVC, etc.)

## Generation Template

For each new resource, create:

1. **Route file** (`src/routes/{resource}.ts`)
   - Zod validation schemas
   - Route handlers that parse and delegate
   - NO business logic in routes

2. **Service file** (`src/services/{resource}Service.ts`)
   - Business rules and validation
   - Orchestration of repo calls
   - Domain error throwing

3. **Repo file** (`src/repos/{resource}Repo.ts`)
   - Data access only
   - Prisma operations
   - NO business logic

4. **Test file** (`tests/{resource}.test.ts`)
   - Happy path tests
   - Edge case tests
   - Error handling tests

## Naming Conventions

- Files: camelCase (`orderService.ts`)
- Classes: PascalCase (`OrderService`)
- Routes: kebab-case (`/api/order-items`)
- Database: snake_case (handled by Prisma)
