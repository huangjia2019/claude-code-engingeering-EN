# Chapter 10 — From Individual to Team: Engineering Practices for Claude Code

Everything up to here made one engineer faster. This chapter is about what breaks when ten
engineers do it at once: cost, debugging, security, scale, instructions, and collaboration.

## What's here

| Path | What it is |
|---|---|
| [`claude-md-hierarchy/`](claude-md-hierarchy/) | Layered `CLAUDE.md` for a monorepo — root + per-package |
| [`permissions/`](permissions/) | The five permission modes, and a narrow Bash allowlist |
| [`scripts/track-cost.sh`](scripts/track-cost.sh) | Read cost out of `--output-format json` |
| [`hooks/audit-log.sh`](hooks/audit-log.sh) | Append every tool call to an audit log |

## Cost: the formula that decides the model

Real cost is not the API bill. It is:

```
real cost = API cost + human time cost
```

A task that takes Opus 5 minutes and Haiku 30 minutes of re-prompting, at a $50/hour rate:

| | human time | API | total |
|---|---|---|---|
| Opus | 5 min = $4.17 | ~$1.33 | **$5.50** |
| Haiku | 30 min = $25.00 | ~$0.03 | **$25.03** |

Choose Opus. Cheap models are only cheap when they get it right the first time.

> Model pricing changes. Always check the official Anthropic pricing page for current figures.

## Sharing strategy for `.claude/`

| Path | Commit it? | Why |
|---|---|---|
| `.claude/settings.json` | Yes | Team-wide permissions and hooks |
| `.claude/settings.local.json` | **No** | Personal overrides — add to `.gitignore` |
| `.claude/agents/`, `.claude/skills/` | Yes | Shared capability |
| `CLAUDE.md` | Yes | Shared context |
| `CLAUDE.local.md` | **No** | Personal context |
