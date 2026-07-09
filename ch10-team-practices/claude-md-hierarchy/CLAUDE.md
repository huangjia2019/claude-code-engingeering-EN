# Monorepo — root context

Conventions that apply to every package. Keep this file under ~200 lines; anything
package-specific belongs in that package's own CLAUDE.md.

## Commands
- Build:  `pnpm build`
- Test:   `pnpm test`
- Lint:   `pnpm lint --fix`

## Standards
- TypeScript strict mode everywhere. No `any` without a comment explaining why.
- Every exported function needs a test. No exceptions for "trivial" code.
- Conventional Commits for commit messages.

## Architecture constraints
- `packages/web` may import from `packages/api` types only — never its runtime.
- Database access is confined to `packages/api/src/db/`. Nothing else opens a connection.
