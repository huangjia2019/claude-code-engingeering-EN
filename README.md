# Claude Code Engineering Workshop — Hands-On Labs

Companion repository for the **Claude Code Engineering in Practice** workshop.

## Step 1: Install Claude Code

### Prerequisites

- **Node.js 20+** — Check: `node --version`
- **An Anthropic API key** or **Claude Pro/Max subscription**

### Install

```bash
npm install -g @anthropic-ai/claude-code
```

### Verify

```bash
claude
```

You should see the Claude Code welcome screen:

![Claude Code CLI](https://www.bannerbear.com/images/ghost/2026-01-21-how-to-install-claude-code-terminal-ide-web-desktop-setup/2.png)

> If prompted, log in with your Anthropic Console account or Claude subscription.

## Step 2: Clone This Repository

```bash
git clone https://github.com/huangjia2019/claude-code-engingeering-EN.git
cd claude-code-engingeering-EN
```

## Workshop Modules

| Module | Directory | Topic | Time |
|--------|-----------|-------|------|
| 1 | `01-memory/` | Memory System — CLAUDE.md | 5 min |
| 2 | `02-skills/` | Skills — On-Demand Expertise | 5 min |
| 3 | `03-subagents/` | Sub-Agents — Divide and Conquer | 5 min |

Follow the exercises in each module's `README.md`.

## Quick Reference

| What | Command |
|------|---------|
| Install Claude Code | `npm install -g @anthropic-ai/claude-code` |
| Start Claude Code | `claude` |
| Initialize memory | `/init` (inside Claude Code) |
| Check version | `claude --version` |

## Workshop Presenter

**Jia Huang** — Claude Code Engineering in Practice
