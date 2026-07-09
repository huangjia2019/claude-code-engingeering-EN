#!/usr/bin/env bash
# The four dimensions of headless control.
set -euo pipefail

# 1. Output format — text (default), json, stream-json
claude -p "Summarize the architecture of src/" --output-format json > result.json
jq -r '.result' result.json

# 2. Turn cap — bound the agent's reasoning loop
claude -p "Find the bug in src/auth.ts" --max-turns 5

# 3. Budget cap — bound the spend, in USD
claude -p "Review the whole repository" --max-budget-usd 0.50

# 4. Tool allowlist — read-only means read-only
claude -p "Check variable naming in this function" \
  --model claude-haiku-4-5 \
  --allowedTools "Read,Grep,Glob"

# Watch the model think, token by token
claude -p "Explain the caching layer" --output-format stream-json
