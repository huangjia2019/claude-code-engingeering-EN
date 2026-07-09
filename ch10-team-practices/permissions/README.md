# Permission modes and allowlists

Claude Code offers five permission modes:

| Mode | What it does |
|---|---|
| `default` | Prompts before each write or shell command |
| `plan` | Read-only. Claude can analyze but not change anything. |
| `acceptEdits` | Auto-accepts file edits, still prompts for Bash |
| `bypassPermissions` | No prompts. Use only in a sandbox or container. |
| `dangerously-skip-permissions` | Same, and named to make you think twice |

`settings.json` here shows a narrow Bash allowlist — the practical middle ground between
"prompt for everything" and "allow everything".
