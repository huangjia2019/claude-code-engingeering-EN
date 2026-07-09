# Chapter 1 — A Broad Perspective: Claude Code's Technical Architecture

This chapter is the map. There is little code to run here; instead, it establishes the lens the
rest of the book uses: **an agent is a Model plus a Harness.**

## The four layers of a Harness

| Layer | Question it answers | Claude Code mechanism | Chapter |
|---|---|---|---|
| **Context** | What does the agent know? | `CLAUDE.md`, memory scopes | [ch02](../ch02-memory/) |
| **Tools** | What can the agent do? | Skills, sub-agents, MCP | [ch03](../ch03-skills/), [ch04](../ch04-subagents/), [ch06](../ch06-mcp/) |
| **Execution** | Where does it run? | Headless, Agent SDK, Plugins | [ch07](../ch07-headless-cicd/), [ch08](../ch08-agent-sdk/), [ch09](../ch09-plugins/) |
| **Governance** | What is it allowed to do? | Hooks, permissions, cost limits | [ch05](../ch05-hooks/), [ch10](../ch10-team-practices/) |

## Verify your setup

```bash
node --version      # 20+
python3 --version   # 3.10+
npm install -g @anthropic-ai/claude-code
claude --version
```

Then start Claude Code in any project directory:

```bash
claude
```

Everything else in this repository is organized by chapter. Start with
[ch02-memory](../ch02-memory/) — context is the first layer of the Harness.
