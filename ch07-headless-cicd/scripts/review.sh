#!/usr/bin/env bash
# A local code-review script.
#
# The subtlety: under `set -e`, a failing command inside a command substitution
# does NOT abort the script — the assignment succeeds with empty output. So we
# write to a file, check the exit code explicitly, and only then read it back.
set -euo pipefail

OUT=review.txt

if ! claude -p "Review the staged changes. Focus on logic errors and security. \
End your reply with exactly one line: <VERDICT>approve</VERDICT> or <VERDICT>request_changes</VERDICT>" \
      --output-format text \
      --max-turns 10 \
      --max-budget-usd 0.50 \
      --allowedTools "Read,Grep,Glob" > "$OUT"; then
  echo "claude failed (exit $?)" >&2
  exit 1
fi

cat "$OUT"

# Exact-match the sentinel. -F means "fixed string", not a regex.
if grep -qF '<VERDICT>request_changes</VERDICT>' "$OUT"; then
  echo "Review requested changes." >&2
  exit 1
fi

echo "Review approved."
