# packages/web

Inherits the root CLAUDE.md. Only what differs here.

- React + Vite. Components are function components; no class components.
- State: TanStack Query for server state, `useState` for local. No Redux.
- Never call `fetch` directly from a component — use the generated client in `src/api/`.
