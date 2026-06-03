# Module 3: Sub-Agents — Divide and Conquer

> 中文讲解稿见 [`zh/README.md`](zh/README.md)。

## Overview

In this module you'll see **two complementary SubAgent designs**:

| Demo | Topology | What it teaches |
|---|---|---|
| `bugfix-demo/` + `.claude/agents/bug-*` | **Serial pipeline** (locator → fixer → verifier) | Least-privilege tool gating between stages |
| `multi-agent-review/` | **Parallel fan-out** (4 reviewers concurrent) | Context isolation + diverse-lens ensemble |

Both run with isolated sub-contexts — the main conversation only sees summaries.

## Demo A · Bug-Fix Pipeline (Serial)

### Agent Configurations (`.claude/agents/`)

| Agent | Role | Tools | Motto |
|-------|------|-------|-------|
| `bug-locator.md` | Find the bug | Read, Grep, Glob | "Eyes only" |
| `bug-fixer.md` | Fix the bug | Read, Edit, Write | "Hands, no feet" |
| `bug-verifier.md` | Verify the fix | Read, Bash, Grep | "Feet, no hands" |

### Bug-Fix Demo (`bugfix-demo/`)

A Node.js project with **3 intentional bugs** for pipeline practice.

## Demo B · Multi-Agent Review (Parallel Fan-Out)

A standalone worked example that **measures** the coverage difference between single-agent and 4-agent parallel review.

| Approach | Findings on a 62-line file with 22 seeded issues | Main-context tokens |
|---|---|---|
| Single agent, generic review | 5 / 22 (23% coverage) | 1,121 |
| **4 specialized agents in parallel** | 22 / 22 (100% coverage) | 1,709 main (11,094 isolated, 86.7% hidden from main) |

Files: `multi-agent-review/.claude/agents/{security,performance,quality,docs}-reviewer.md` + `sample-code/checkout.js` (62 lines, 22 seeded issues) + `walkthrough.md`.

## Exercises

### Exercise 1: Understand the Pipeline (2 min)

1. Read each agent file in `.claude/agents/`
2. Notice the tool permissions — each agent has DIFFERENT allowed tools
3. Key principle: **Least Privilege** — each agent gets only what it needs

### Exercise 2: Run the Full Pipeline (5 min)

1. Start Claude Code in `03-subagents/` directory: `claude`
2. Say: `"There's a bug in bugfix-demo — users report that the cart total is wrong. Use the bug-fix pipeline to find and fix it."`
3. Watch Claude orchestrate:
   - **bug-locator** searches the code (Read, Grep, Glob only)
   - **bug-fixer** applies the fix (Read, Edit, Write only)
   - **bug-verifier** runs the tests (Read, Bash, Grep only)
4. Notice: your main conversation stays clean — only summaries come back

### Exercise 3: Observe Context Isolation (3 min)

1. After the pipeline completes, check your conversation
2. Count how many tokens of noise reached your main context
3. The sub-agents processed potentially thousands of lines, but you only see the conclusions

### Exercise 4: Find the Other Bugs (5 min)

There are 3 bugs total in `bugfix-demo/`. Try:
- `"Run the tests and fix any failures using the pipeline"`
- `"The discount calculation seems wrong. Investigate and fix."`

## The Three Bugs

(Don't peek until after the exercise!)

1. **Cart total bug** — `src/cart.ts` — off-by-one in quantity calculation
2. **Discount bug** — `src/discount.ts` — percentage applied incorrectly (divides by 10 instead of 100)
3. **Auth bug** — `src/auth.ts` — token comparison uses `=` instead of `===` timing-safe comparison
