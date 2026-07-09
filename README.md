# The Claude Code Operating Model — Code Examples

Companion repository for **_The Claude Code Operating Model_** (Packt, 2026) by **Jia Huang** —
*Build scalable AI coding systems with Skills, MCP, Hooks, agent orchestration, and SDK patterns.*

Every chapter has a directory here. The code is runnable, and it reflects the **corrected** APIs as
of publication — where the printed text and the current SDK disagree, this repository is right.

## Setup

```bash
# Prerequisites: Node.js 20+, Python 3.10+, Git
npm install -g @anthropic-ai/claude-code
claude --version

export ANTHROPIC_API_KEY=sk-ant-...   # or sign in with a Claude subscription

git clone https://github.com/huangjia2019/claude-code-engingeering-EN.git
cd claude-code-engingeering-EN
```

## Chapters

| Chapter | Directory | What you'll run |
|---|---|---|
| 1 · A Broad Perspective | [`ch01-overview/`](ch01-overview/) | Setup check; the four-layer Harness map |
| 2 · Learning from the Past | [`ch02-memory/`](ch02-memory/) | `CLAUDE.md` before/after on a real project |
| 3 · Teaching to Fish | [`ch03-skills/`](ch03-skills/) | Three Skills; progressive disclosure measured in tokens |
| 4 · Divide and Conquer | [`ch04-subagents/`](ch04-subagents/) | Serial bug-fix pipeline; parallel multi-lens review |
| 5 · From Guidelines to Guardrails | [`ch05-hooks/`](ch05-hooks/) | A hook that blocks `rm -rf`; a hook that auto-formats |
| 6 · Connecting Everything | [`ch06-mcp/`](ch06-mcp/) | `.mcp.json` scopes; a custom MCP server |
| 7 · Headless Mode and CI/CD | [`ch07-headless-cicd/`](ch07-headless-cicd/) | GitHub Actions, GitLab CI, Jenkins |
| 8 · Agent SDK | [`ch08-agent-sdk/`](ch08-agent-sdk/) | Custom tools, structured output, a FastAPI service |
| 9 · The Plugin Ecosystem | [`ch09-plugins/`](ch09-plugins/) | An installable plugin; a private marketplace |
| 10 · From Individual to Team | [`ch10-team-practices/`](ch10-team-practices/) | Layered `CLAUDE.md`, permissions, cost, audit |

## Workshop

[`workshop/`](workshop/) holds the running order for the live *Claude Code Engineering in Practice*
workshop. It points into the chapter directories rather than duplicating them, so the labs and the
book never drift apart.

## The four layers

The book's organizing idea is that an agent is a **Model** plus a **Harness**, and the Harness has
four layers. The chapters fill them in, in order:

| Layer | Question | Chapters |
|---|---|---|
| **Context** | What does the agent know? | 1–2 |
| **Tools** | What can it do? | 3, 4, 6 |
| **Execution** | Where does it run? | 7, 8, 9 |
| **Governance** | What is it allowed to do? | 5, 10 |

## Errata

The tools moved while the book was in production. Where the printed text differs from the code here,
**the code here is correct**. The most consequential corrections:

| Topic | Printed | Correct |
|---|---|---|
| Python SDK messages | `message.type == "assistant"` | `isinstance(message, AssistantMessage)` — dataclasses have no `.type`. *(TypeScript's `message.type === 'assistant'` is fine.)* |
| `@tool` decorator | `parameters={...}` | `input_schema={...}` |
| `ClaudeAgentOptions` | `append_system_prompt=...` | `system_prompt={"type": "preset", "preset": "claude_code", "append": ...}` |
| `ClaudeAgentOptions` | `mcp_servers=[...]` | `mcp_servers={...}` (a dict), and there is no `no_session_persistence` |
| Plugin hooks | flat array in `hooks.json` | nested `{"hooks": {"PreToolUse": [{"matcher", "hooks": [...]}]}}` |
| `marketplace.json` | `repository` + `version` per entry | top-level `owner`, and `source` per entry |
| Uninstall a plugin | `/plugin remove` | `/plugin uninstall` |
| Headless flag | `--allowed-tools` | `--allowedTools` (camelCase) |
| Hook blocking | any non-zero exit | **only exit code 2** blocks and returns stderr to Claude |
| Hook input | `CLAUDE_FILE_PATH` env var | read JSON from stdin: `jq -r '.tool_input.file_path'` |

Found another? Please [open an issue](https://github.com/huangjia2019/claude-code-engingeering-EN/issues).

## About the author

**Jia Huang** is an AI researcher at A*STAR, Singapore. He is the author of *Designing AI Agents*
(Manning) and *RAG from First Principles* (Packt), and proposed the dual-axis framework for agent
design patterns and the Pattern Selection Card.

## License

MIT — see [LICENSE](LICENSE).
