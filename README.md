# Claude Code Engineering Workshop — Hands-On Labs

Companion repository for the **Claude Code Engineering in Practice** workshop. Four self-contained modules, each pairing a theory pain-point with a runnable demo that **measures** the design's impact.

## Step 1: Install Claude Code

### Prerequisites

- **Node.js 20+** — Check: `node --version`
- **Python 3.10+** — Check: `python3 --version`
- **An Anthropic API key** or **Claude Pro/Max subscription**

### Install

```bash
npm install -g @anthropic-ai/claude-code
```

### Verify

```bash
claude
```

You should see the Claude Code welcome screen. If prompted, log in with your Anthropic Console account or Claude subscription.

## Step 2: Clone This Repository

```bash
git clone git@github.com:huangjia2019/claude-code-engingeering-EN.git
cd claude-code-engingeering-EN
```

## Workshop Modules

Each module ships with one or two **deep walkthroughs**. Each walkthrough has:

- A theory pain-point it addresses (paired with one slide in the workshop deck)
- A `walkthrough.md` with step-by-step terminal commands
- A `before-output.txt` (the naïve baseline)
- An `after-output.txt` (the same task with the Claude Code mechanism applied)
- A `screenshots/CAPTURE.md` with a capture list for live demos

| # | Module | Demos | Pattern | Measured impact |
|---|---|---|---|---|
| 1 | [`01-memory/`](01-memory/) | `emoji-match/` + `CLAUDE.md.{init,enhanced}` | Project memory · onboarding | "AI knows project conventions on first turn" |
| 2 | [`02-skills/`](02-skills/) | `demo-project/` + **`financial-analyzing-walkthrough/`** | Progressive disclosure | **−35% to −78% per-turn tokens** vs monolith prompt |
| 3 | [`03-subagents/`](03-subagents/) | `bugfix-demo/` (serial pipeline) + **`multi-agent-review/`** (parallel fan-out) | Context isolation + diverse-lens | **23% → 100% finding coverage**, 86.7% tokens kept out of main context |
| 4 | [`04-hooks/`](04-hooks/) | **`01-safety-hooks/`** + **`02-quality-hooks/`** | Deterministic gate (pre/post) | **10/10 dangerous patterns blocked**; auto-format across .js/.py/.json |

Modules and demos in **bold** are the new V3 deep walkthroughs (May 2026).

## How to Run a Demo

```bash
# Example: try the safety-hook
cd 04-hooks/01-safety-hooks
claude

# Inside Claude Code:
# > Clean up sample-target/ with rm -rf
# (Watch the hook block the dangerous edge case, then Claude self-correct.)
```

Every walkthrough.md is self-contained — no setup files needed beyond the module's own scripts.

## Workshop-Slide Pairing

| Theory slide (V3 deck) | Demo to run |
|---|---|
| §3 · "CLAUDE.md 三层记忆" | `01-memory/emoji-match/` |
| §3 · "Skills 按需加载 · token 降本利器" | `02-skills/financial-analyzing-walkthrough/` |
| §3 · "SubAgent · 上下文隔离" + "复合错误数学" | `03-subagents/multi-agent-review/` |
| §4 · "防幻觉路径" + "5 大扩展机制" | `04-hooks/01-safety-hooks/` + `02-quality-hooks/` |

## Quick Reference

| What | Command |
|------|---------|
| Install Claude Code | `npm install -g @anthropic-ai/claude-code` |
| Start Claude Code | `claude` |
| Start in a specific dir | `claude --cwd <path>` |
| Initialize memory | `/init` (inside Claude Code) |
| Check version | `claude --version` |

## Design Principle Behind the Demos

Each demo is built to **show numbers**, not just feature checkboxes:

- Skills demo measures tokens before/after
- SubAgent demo measures finding coverage and context isolation ratio
- Hooks demo measures block rate and graceful-degradation behavior

Workshops that show "feature X exists" don't transfer; workshops that show "feature X changed my measurement by Y" do.

## Workshop Presenter

**Jia Huang** — *Designing AI Agents* (Manning, in production) · Claude Code Engineering in Practice
