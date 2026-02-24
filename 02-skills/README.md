# Module 2: Skills — On-Demand Expertise

## Overview

In this module, you'll build reusable Skills that Claude auto-discovers and loads when relevant.

## What's Included

### Pre-built Skills (`.claude/skills/`)

| Skill | Description | Tools |
|-------|-------------|-------|
| `code-reviewing` | Security, performance, quality review | Read, Grep, Glob |
| `financial-analyzing` | Revenue, costs, profitability analysis | Read, Grep, Glob |
| `api-generating` | REST API endpoint generator | Read, Edit, Write, Bash |

### Demo Project (`demo-project/`)

A small Express→Fastify migration project with intentional issues for code review practice.

## Exercises

### Exercise 1: Explore a Skill (3 min)

1. Open `.claude/skills/code-reviewing/SKILL.md`
2. Notice the three parts:
   - **Frontmatter**: name, description (trigger logic), allowed-tools
   - **Content**: Review checklist and output format
3. Key insight: The `description` field is for Claude's decision engine, not for humans

### Exercise 2: Trigger a Skill Naturally (3 min)

1. Start Claude Code in `02-skills/` directory: `claude`
2. Say: `"Review the code in demo-project/src/app.ts"`
3. Watch Claude auto-discover and load the code-reviewing skill
4. Notice the structured output: Critical → Major → Minor

### Exercise 3: Test the Financial Analysis Skill (3 min)

1. Say: `"Analyze the revenue data in demo-project/data/"`
2. Watch Claude load the financial-analyzing skill
3. Notice: it loads SKILL.md first, then only pulls reference files as needed (progressive disclosure)

### Exercise 4: Build Your Own Skill (5 min)

1. Create `.claude/skills/test-reviewing/SKILL.md`
2. Write a description that triggers on "review tests" or "check test quality"
3. Define the checklist: coverage gaps, missing edge cases, test naming
4. Set allowed-tools to Read, Grep, Glob (read-only — safe!)
5. Test it: `"Review the tests in demo-project/tests/"`
