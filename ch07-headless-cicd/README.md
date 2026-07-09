# Chapter 7 — Headless Mode and CI/CD Integration

Headless mode takes Claude Code off the interactive terminal. Anywhere Node.js runs, `claude -p`
runs — which means your CI pipeline can review code, triage failures, and write reports unattended.

## What's here

| Path | What it is |
|---|---|
| [`scripts/basic-headless.sh`](scripts/basic-headless.sh) | The four control dimensions: output format, turns, budget, tools |
| [`scripts/review.sh`](scripts/review.sh) | A local review script that survives `set -e` correctly |
| [`github-actions/pr-review.yml`](github-actions/pr-review.yml) | PR review on GitHub Actions, with a machine-readable verdict |
| [`gitlab/.gitlab-ci.yml`](gitlab/.gitlab-ci.yml) | The same review as a GitLab merge-request job |
| [`jenkins/Jenkinsfile`](jenkins/Jenkinsfile) | A Declarative Pipeline with credential binding |

## The four control dimensions

```bash
claude -p "Review the changes on this branch" \
  --output-format json \        # machine-readable result + cost metadata
  --max-turns 10 \              # cap the agent's turns
  --max-budget-usd 0.50 \       # cap the spend
  --allowedTools "Read,Grep,Glob"   # read-only: no writes, no shell
```

Note the flag is **`--allowedTools`** (camelCase), and the model is named in full
(`claude-haiku-4-5`, not `haiku`) so the intent survives future aliases.

## Two rules the examples follow

**1. Emit a sentinel, don't grep prose.** A review that decides a build's fate must not depend on
the word "critical" appearing in free text. Have Claude print a unique token and test for it exactly:

```bash
grep -qF '<VERDICT>request_changes</VERDICT>' review.txt && exit 1
```

**2. Don't interpolate multi-line output into a template literal.** Write it to a file and read it
back, or pass it through `env:` — otherwise a backtick in the review body breaks your script.
Both patterns are used in [`github-actions/pr-review.yml`](github-actions/pr-review.yml).
