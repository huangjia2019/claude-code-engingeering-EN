# Module 3: Sub-Agents — Divide and Conquer

## Overview

In this module, you'll build a **Bug-Fix Pipeline** using three specialized sub-agents, each with different tool permissions.

## What's Included

### Agent Configurations (`.claude/agents/`)

| Agent | Role | Tools | Motto |
|-------|------|-------|-------|
| `bug-locator.md` | Find the bug | Read, Grep, Glob | "Eyes only" |
| `bug-fixer.md` | Fix the bug | Read, Edit, Write | "Hands, no feet" |
| `bug-verifier.md` | Verify the fix | Read, Bash, Grep | "Feet, no hands" |

### Bug-Fix Demo (`bugfix-demo/`)

A Node.js project with **3 intentional bugs** for pipeline practice.

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
