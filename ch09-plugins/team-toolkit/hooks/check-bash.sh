#!/usr/bin/env bash
# Block dangerous Bash commands before they run.
# A PreToolUse hook communicates its decision on stdout as JSON.
set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

DANGEROUS_PATTERNS=("rm -rf /" "rm -rf ~" "sudo rm" "> /dev/" "chmod 777")

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "$COMMAND" | grep -qF "$pattern"; then
        cat << EOF
{"decision": "deny", "reason": "Blocked dangerous pattern: $pattern"}
EOF
        exit 0
    fi
done

echo '{"decision": "allow"}'
