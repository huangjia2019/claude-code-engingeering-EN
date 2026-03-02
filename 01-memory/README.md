# Module 1: Memory System — CLAUDE.md

## Overview

In this module, you'll learn how to give Claude a permanent memory using CLAUDE.md.

## The Demo Project: Emoji Match 🧠

A fun browser-based emoji memory card game. No build step required — just open and play.

```bash
cd emoji-match
npx serve .        # or just open index.html in your browser
```

## Demo Flow (Live)

### Step 1: Show the project

Open `emoji-match/` in your browser. Play a round — it's a 4×4 grid of emoji cards with neon dark theme, flip animations, move counter, and timer.

### Step 2: Generate CLAUDE.md with `/init`

```bash
cd emoji-match
claude          # start Claude Code
# type: /init
```

Claude scans the project and auto-generates `CLAUDE.md`. Compare with `../CLAUDE.md.init` — it captures the WHAT (tech stack, file structure) but misses the WHY (project conventions).

### Step 3: Test without conventions

Ask Claude: *"Add a difficulty selector — easy (3×2), medium (4×4), hard (6×4)"*

Notice: Claude uses `camelCase` functions, generic CSS class names, no emoji in messages, hardcoded colors. It doesn't know your project rules.

### Step 4: Add the enhanced CLAUDE.md

```bash
cp ../CLAUDE.md.enhanced ./CLAUDE.md
```

Start a NEW Claude Code session and ask the same question.

### Step 5: See the difference

Now Claude follows your conventions:
- ✅ `snake_case` functions: `set_difficulty()`, `create_board()`
- ✅ `mg-` prefixed CSS: `.mg-difficulty-selector`
- ✅ Emoji-first messages: `"🎯 Choose your difficulty!"`
- ✅ CSS custom properties: `var(--mg-primary)`

## Reference Files

| File | Location | Purpose |
|------|----------|---------|
| `CLAUDE.md.init` | `01-memory/` | What `/init` typically generates (tech stack only) |
| `CLAUDE.md.enhanced` | `01-memory/` | Complete version with project conventions |

## Also Included: order-service

A Node.js + TypeScript + Fastify microservice example for reference. Demonstrates CLAUDE.md for backend projects with architectural decisions (layered architecture, Fastify over Express, Zod validation).
