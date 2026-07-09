#!/usr/bin/env bash
# PostToolUse hook: append every file-modifying tool call to an audit log.
# Hook input arrives as JSON on stdin — there are no CLAUDE_* environment variables.
set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // "unknown"')
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

mkdir -p .claude
printf '%s\t%s\t%s\n' "$(date -Iseconds)" "$TOOL" "${FILE:-—}" >> .claude/audit.log

# Exit 0 = allow. Only exit code 2 blocks the tool call and returns stderr to Claude.
exit 0
