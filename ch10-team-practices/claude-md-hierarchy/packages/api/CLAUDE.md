# packages/api

Inherits the root CLAUDE.md. Only what differs here.

- Framework: FastAPI. Routes in `src/routes/`, one module per resource.
- Every route that changes state requires an explicit authorization check.
- Queries on user-facing endpoints must be bounded (`LIMIT`).
- Run a single test: `pytest tests/test_orders.py::test_create -x`
