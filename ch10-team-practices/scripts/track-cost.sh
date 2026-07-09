#!/usr/bin/env bash
# Every headless run reports what it spent. Log it, and the monthly bill stops being a surprise.
set -euo pipefail

claude -p "$1" \
  --output-format json \
  --max-turns 10 \
  --max-budget-usd 0.50 \
  --allowedTools "Read,Grep,Glob" > run.json

COST=$(jq -r '.total_cost_usd' run.json)
TURNS=$(jq -r '.num_turns'      run.json)
MS=$(jq -r '.duration_ms'       run.json)

printf '%s\t%s\t%s\t%s\n' "$(date -Iseconds)" "$COST" "$TURNS" "$MS" >> .claude/cost.tsv
echo "cost=\$${COST}  turns=${TURNS}  duration=${MS}ms"

jq -r '.result' run.json
