# Chapter 9 — From Personal Craft to Shared Asset: The Plugin Ecosystem

A Skill you wrote, a sub-agent you tuned, a Hook that saved you once — these are personal craft
until they are packaged. A Plugin is the package: one Git repository that carries commands,
agents, Skills, Hooks, and MCP servers, installable in one command.

## What's here

| Path | What it is |
|---|---|
| [`team-toolkit/`](team-toolkit/) | A complete, installable plugin — command + agent + Skill + Hook |
| [`marketplace/marketplace.json`](marketplace/marketplace.json) | A private marketplace index |

## Install the example plugin

```bash
/plugin install ./ch09-plugins/team-toolkit
/plugin uninstall team-toolkit
```

## Private marketplace

A private marketplace is just a Git repository whose root holds a `marketplace.json`:

```bash
/plugin marketplace add our-company/claude-plugins
/plugin install team-toolkit@our-company
```

## Two schema details that are easy to get wrong

**1. `hooks/hooks.json` uses the same nested shape as `settings.json`.** A flat array is silently
ignored — the hook never fires:

```json
{ "hooks": { "PreToolUse": [ { "matcher": "Bash",
  "hooks": [ { "type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/check-bash.sh" } ] } ] } }
```

**2. `marketplace.json` needs a top-level `owner`, and each entry uses `source`.** `version`
belongs in the plugin's own `plugin.json`, not in the marketplace entry.
