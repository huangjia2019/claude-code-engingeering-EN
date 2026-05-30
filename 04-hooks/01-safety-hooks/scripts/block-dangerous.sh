#!/usr/bin/env bash
# PreToolUse hook · block dangerous Bash commands.
#
# Claude Code passes tool call data via STDIN JSON, NOT via env vars.
# Schema: { "tool_input": { "command": "<the bash command>" }, ... }
#
# Exit code 0 = allow.
# Exit code 2 + stderr message = block (Claude sees the reason).
# Exit code other = unknown error, hook is bypassed (UNSAFE).
#
# THIS HOOK FAILS CLOSED: if it cannot parse input or detect missing
# dependencies, it BLOCKS rather than silently allowing.

set -uo pipefail

INPUT="$(cat)"

# Extract the command field. Prefer python3 (always available); fall
# back to a minimal grep-based parser only if python3 also missing.
extract_cmd() {
  if command -v python3 >/dev/null 2>&1; then
    python3 -c '
import json, sys
try:
    d = json.loads(sys.stdin.read())
    print(d.get("tool_input", {}).get("command", ""))
except Exception:
    sys.exit(99)
' <<< "$INPUT"
    return $?
  fi
  return 99
}

CMD="$(extract_cmd)" || {
  echo "BLOCKED by safety-hook: could not parse tool input (python3 missing or malformed JSON). Fail-closed: blocking." >&2
  exit 2
}

# Empty command — let Claude Code surface the malformed call itself.
if [ -z "$CMD" ]; then
  exit 0
fi

block() {
  echo "BLOCKED by safety-hook: $1" >&2
  echo "Command: $CMD" >&2
  exit 2
}

# --- Catastrophic deletion ---
if echo "$CMD" | grep -qE '\brm[[:space:]]+(-[a-zA-Z]+[[:space:]]+)*/($|[[:space:]])'; then
  block "rm targeting root '/' is never allowed."
fi
if echo "$CMD" | grep -qE '\brm[[:space:]]+-[a-zA-Z]*[rR][a-zA-Z]*[fF][a-zA-Z]*[[:space:]]+/[^[:space:]]'; then
  TARGET=$(echo "$CMD" | grep -oE 'rm[[:space:]]+-[a-zA-Z]+[[:space:]]+\S+' | awk '{print $NF}')
  case "$TARGET" in
    /tmp/*|/var/tmp/*|"$HOME"/.cache/*) : ;;
    *) block "rm -rf outside /tmp or ~/.cache is not allowed in this workshop. Target was: $TARGET" ;;
  esac
fi

# --- Privilege escalation ---
if echo "$CMD" | grep -qE '(^|[[:space:]]|;|&&|\|\|)sudo([[:space:]]|$)'; then
  block "sudo is not allowed inside Claude Code in this workshop."
fi

# --- Remote-piped execution ---
if echo "$CMD" | grep -qE '(curl|wget)[^|]*\|[[:space:]]*(sh|bash|zsh)'; then
  block "Piping remote downloads to a shell (curl|sh / wget|bash) is blocked. Save to file and review first."
fi

# --- Device-level writes ---
if echo "$CMD" | grep -qE '(>[[:space:]]*/dev/|dd[[:space:]]+.*of=/dev/)'; then
  block "Writing to /dev/* devices is blocked."
fi

# --- Permission disasters ---
if echo "$CMD" | grep -qE 'chmod[[:space:]]+-[rR]?[[:space:]]*777[[:space:]]+/'; then
  block "Recursive chmod 777 on root paths is blocked."
fi

# --- Fork bomb ---
if echo "$CMD" | grep -qE ':\(\)\{[[:space:]]*:\|:&[[:space:]]*\};:'; then
  block "Fork bomb pattern detected."
fi

# --- Dangerous git ---
if echo "$CMD" | grep -qE '\bgit[[:space:]]+push[[:space:]]+.*--force.*[[:space:]](main|master)\b'; then
  block "git push --force to main/master rewrites shared history. Use --force-with-lease and a non-main branch."
fi
if echo "$CMD" | grep -qE '\bgit[[:space:]]+reset[[:space:]]+--hard[[:space:]]+origin/'; then
  block "git reset --hard origin/<branch> discards local work without backup. Run 'git stash' first."
fi

exit 0
