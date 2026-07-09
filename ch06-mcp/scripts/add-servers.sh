#!/usr/bin/env bash
# `claude mcp add` recipes. Default scope is `local`; pass --scope project to
# write into a committed .mcp.json instead.
set -euo pipefail

# Project scope — shared with the team via .mcp.json
claude mcp add app-tools --scope project -- python ./custom-server/server.py

# Local scope (default) — just for you, on this machine
claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem ./src

# Credentialed server — keep the token out of the repo
claude mcp add github --env GITHUB_TOKEN="$GITHUB_TOKEN" -- npx -y @modelcontextprotocol/server-github

claude mcp list
