# Workshop — Claude Code Engineering in Practice

The hands-on labs from the live workshop. **The code lives in the book chapters** — this folder is
the running order, so nothing is duplicated and the demos stay in sync with the text.

Each lab pairs a theory pain-point with a runnable demo that **measures** the design's impact.

| # | Lab | Where the code lives | Pattern | Measured impact |
|---|---|---|---|---|
| 1 | Project memory · onboarding | [`ch02-memory/`](../ch02-memory/) — `emoji-match/` + `CLAUDE.md.{init,enhanced}` | Context injection | "AI knows project conventions on the first turn" |
| 2 | Progressive disclosure | [`ch03-skills/`](../ch03-skills/) — **`financial-analyzing-walkthrough/`** | Load capability on demand | **−35% to −78% per-turn tokens** vs a monolithic prompt |
| 3 | Context isolation + diverse lenses | [`ch04-subagents/`](../ch04-subagents/) — `bugfix-demo/` (serial) + **`multi-agent-review/`** (parallel fan-out) | Delegation | **23% → 100% finding coverage**; 86.7% of tokens kept out of the main context |
| 4 | Deterministic gates | [`ch05-hooks/`](../ch05-hooks/) — **`01-safety-hooks/`** + **`02-quality-hooks/`** | Pre/post enforcement | **10/10 dangerous patterns blocked**; auto-format across `.js` / `.py` / `.json` |

## How each lab is built

- A `walkthrough.md` with step-by-step terminal commands
- A `before-output.txt` — the naïve baseline
- An `after-output.txt` — the same task with the mechanism applied

> Outputs marked *illustrative* are hand-written to explain the contrast. Run the commands live to
> get the real terminal output.

## Run a lab

```bash
cd ../ch05-hooks/01-safety-hooks
claude

# Inside Claude Code:
# > Clean up sample-target/ with rm -rf
# Watch the hook block the dangerous edge case, then Claude self-correct.
```

## Design principle

Every demo is built to **show a number**, not to check a feature box.

- The Skills demo measures tokens before and after.
- The sub-agent demo measures finding coverage and the context-isolation ratio.
- The Hooks demo measures block rate and graceful-degradation behavior.

Workshops that show "feature X exists" don't transfer. Workshops that show "feature X moved my
measurement by Y" do.

## Slide pairing (V3 deck)

| Theory slide | Lab |
|---|---|
| CLAUDE.md three-layer memory | `ch02-memory/emoji-match/` |
| Skills · on-demand loading, token economics | `ch03-skills/financial-analyzing-walkthrough/` |
| Sub-agents · context isolation + compounding-error math | `ch04-subagents/multi-agent-review/` |
| Anti-hallucination path + the five extension mechanisms | `ch05-hooks/01-safety-hooks/` + `02-quality-hooks/` |
