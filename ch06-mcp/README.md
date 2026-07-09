# Chapter 6 — Connecting Everything: Integrating External Tools with MCP

The Model Context Protocol (MCP) turns an `N x M` integration problem into `N + M`: every client
speaks one protocol, every tool server implements it once.

## What's here

| Path | What it is |
|---|---|
| [`mcp-config/.mcp.json`](mcp-config/.mcp.json) | Project-scope server config — commit this, it's shared with the team |
| [`mcp-config/user-scope.example.json`](mcp-config/user-scope.example.json) | User-scope config with credentials — lives in `~/.claude.json`, never committed |
| [`custom-server/server.py`](custom-server/server.py) | A minimal custom MCP server exposing two tools |
| [`scripts/add-servers.sh`](scripts/add-servers.sh) | `claude mcp add` one-liners for common servers |

## Where configuration lives

| Scope | File | Use for |
|---|---|---|
| Project | `.mcp.json` in the repo root | Servers the whole team needs. Safe to commit. |
| User | `~/.claude.json` → top-level `mcpServers` | Your personal servers, across all projects. |
| Private / credentialed | `~/.claude.json` → `projects.<path>.mcpServers` | Servers with secrets, scoped to one project. |

`claude mcp add` defaults to **`local`** scope. Pass `--scope project` to write `.mcp.json` instead.

## Run the custom server

```bash
cd custom-server
pip install -r requirements.txt
python server.py            # speaks MCP over stdio

# register it, then start Claude Code
claude mcp add app-tools --scope project -- python "$(pwd)/server.py"
claude
```

Inside Claude Code, `/mcp` lists connected servers and their tools.

## Debugging

```bash
claude --mcp-debug          # verbose MCP handshake + tool listing
claude mcp list             # what's registered, and at which scope
```

> **Security note.** An MCP server can read anything the process can read. Treat a third-party
> server the way you would treat a dependency with shell access — pin it, read it, and scope its
> credentials. See Chapter 5 for the Hooks that gate what a tool is allowed to do.
