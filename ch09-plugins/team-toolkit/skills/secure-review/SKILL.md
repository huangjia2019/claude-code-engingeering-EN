---
name: secure-review
description: Apply the team's secure-review checklist when reviewing code that handles user input, authentication, or database access.
allowed-tools:
  - Read
  - Grep
  - Glob
---
# Secure review checklist

Walk the change against this list, in order. Stop and report as soon as you find
a Critical item — it blocks the merge.

## Critical
- Any SQL built by string concatenation with user input
- Secrets committed in source, config, or test fixtures
- A state-changing endpoint with no authorization check

## High
- User input reaching a shell command
- Unbounded queries (no LIMIT) on user-facing endpoints

## Medium
- Missing input length validation
- Errors returning stack traces to the client

Report findings as: severity, file:line, exploit path, fix.
