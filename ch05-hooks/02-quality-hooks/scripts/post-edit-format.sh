#!/usr/bin/env bash
# PostToolUse hook · auto-format the file just edited or written.
#
# Claude Code passes data via STDIN JSON. The file path lives in
# tool_input.file_path. We dispatch by extension. We NEVER block — at
# worst we log a missing formatter to stderr and move on.

set -uo pipefail

INPUT="$(cat)"

# Parse with python3 (always present); fall back silently if not.
extract_field() {
  local key="$1"
  if command -v python3 >/dev/null 2>&1; then
    python3 -c "
import json, sys
try:
    d = json.loads(sys.stdin.read())
    print(d.get('tool_input', {}).get('${key}', ''))
except Exception:
    pass
" <<< "$INPUT"
  fi
}

FILE_PATH="$(extract_field file_path)"
if [ -z "$FILE_PATH" ] || [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

EXT="${FILE_PATH##*.}"
EXT="${EXT,,}"  # lowercase

note() {
  echo "post-edit-format: $1" >&2
}

format_with_prettier() {
  if command -v npx >/dev/null 2>&1; then
    npx --yes --quiet prettier --log-level silent --write "$FILE_PATH" >/dev/null 2>&1 \
      && note "prettier: formatted $FILE_PATH"
  else
    note "prettier skipped (npx not found)"
  fi
}

format_with_black() {
  if command -v python3 >/dev/null 2>&1 && python3 -m black --version >/dev/null 2>&1; then
    python3 -m black --quiet "$FILE_PATH" 2>/dev/null \
      && note "black: formatted $FILE_PATH"
  else
    note "black skipped (not installed; run: pip install black)"
  fi
}

format_with_shfmt() {
  if command -v shfmt >/dev/null 2>&1; then
    shfmt -w -i 2 "$FILE_PATH" 2>/dev/null \
      && note "shfmt: formatted $FILE_PATH"
  else
    note "shfmt skipped (not installed)"
  fi
}

case "$EXT" in
  js|jsx|ts|tsx|mjs|cjs)    format_with_prettier ;;
  json|jsonc)               format_with_prettier ;;
  md)                       format_with_prettier ;;
  css|scss)                 format_with_prettier ;;
  html|vue|svelte)          format_with_prettier ;;
  py)                       format_with_black ;;
  sh|bash)                  format_with_shfmt ;;
  *) ;;
esac

# Always exit 0 — quality hook MUST NOT block primary flow.
exit 0
