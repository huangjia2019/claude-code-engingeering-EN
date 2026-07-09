# team-toolkit — an example Plugin

One directory that packages a command, a sub-agent, a Skill, and a Hook.

```
team-toolkit/
├── .claude-plugin/
│   └── plugin.json          <- ONLY plugin.json lives in here
├── commands/review.md
├── agents/security-scanner.md
├── skills/secure-review/SKILL.md
└── hooks/
    ├── hooks.json
    └── check-bash.sh
```

Note the physical constraint: **only `plugin.json` sits inside `.claude-plugin/`.** Everything
else (`commands`, `agents`, `skills`, `hooks`) sits at the plugin root — which means the plugin
root is itself a valid Claude Code project directory, so you can develop and test in place.

## Install from a local directory

```bash
/plugin install ./ch09-plugins/team-toolkit
/plugin                       # list installed plugins
/plugin uninstall team-toolkit
```

The uninstall command is **`/plugin uninstall`**. (`/plugin remove` is not a command; the only
`rm` shortcut is for `/plugin marketplace remove`.)
