# Module 4: Hooks — Deterministic Gates

## Overview

Hooks are **deterministic gates** that run before or after every tool call. Unlike prompts (soft constraints that the model can ignore or be talked out of), hooks execute as separate processes — their exit code is law.

Two complementary designs:

| Sub-module | Hook type | Failure mode | Use |
|---|---|---|---|
| [`01-safety-hooks/`](01-safety-hooks/) | **PreToolUse** — block before run | **fail-CLOSED** (deny on doubt) | Catch `rm -rf /`, `sudo`, `curl \| sh`, force-push, dd, fork-bomb |
| [`02-quality-hooks/`](02-quality-hooks/) | **PostToolUse** — polish after run | **fail-OPEN** (skip on missing tool) | Auto-format `.js` / `.py` / `.json` after every Edit/Write |

## Why Both Together

```
Claude planning → ┌──────────┐
                  │  PRE     │ ← safety: reject the dangerous
                  │  hook    │
                  └────┬─────┘
                       ▼
              [tool call executes]
                       │
                       ▼
                  ┌──────────┐
                  │  POST    │ ← quality: polish the rough
                  │  hook    │
                  └────┬─────┘
                       ▼
                  Claude resumes
```

- Safety is the **floor**. If the floor leaks, you lose work / data / machines.
- Quality is the **ceiling**. If the ceiling has a gap, you ship messy code — annoying, not catastrophic.

The exit-code policy is different for each:
- **Safety**: exit 2 on any uncertainty (missing parser, malformed input, regex match). Better to block a valid command than to allow a destructive one.
- **Quality**: exit 0 always. Better to ship unformatted code than to break the entire workflow because `black` isn't installed.

## Quick Start

```bash
# Try safety-hooks
cd 04-hooks/01-safety-hooks
claude

# In Claude Code:
# > Run rm -rf / on a junk directory
# (You'll see the hook block it and Claude self-correct.)
```

```bash
# Try quality-hooks
cd 04-hooks/02-quality-hooks
claude

# In Claude Code:
# > Save a small Express server to /tmp/test/server.js
# (You'll see prettier auto-format the result.)
```

## How Claude Sees the Hook Result

Both hooks communicate with Claude via STDERR + exit code:

| Exit code | Meaning | Claude reaction |
|---|---|---|
| 0 | Approved | Continue normally |
| 2 | Blocked (with stderr reason) | Read reason → adjust → retry |
| anything else | Unknown error | Bypass (UNSAFE for safety hooks — that's why ours fail-closed instead) |

## Pattern Reference

These two demos map to the **Pre/Post Tool Gate** pattern in the Dual-Axis matrix (Cognitive axis: Reflection · Topology axis: Embedded). See `21-Agent设计模式/04-Pattern-Selection-Methodology/` for the full pattern card.

## What You Won't Find Here

- Notification hooks (e.g. Slack on session end) — covered briefly in Module 5 (MCP).
- Custom hook types beyond `command` — Claude Code supports `http`, `mcp_tool`, etc. but these two examples are deliberately bash so they read in 5 minutes.
- Test-runner hooks — those belong in the SubAgent module (`03-subagents/bugfix-demo/`).
