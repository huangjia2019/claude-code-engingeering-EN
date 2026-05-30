# 截图清单 · Skill 渐进披露 Demo

> 按此清单跑一次 demo，每条按 keystroke 提示截屏。截好之后命名为 `01-before-*.png` / `02-after-*.png` 等放入本目录。

| 序号 | 场景 | 截屏时机 | 文件名 |
|---|---|---|---|
| 1 | BEFORE · 朴素 system prompt 加载 | 终端启动后看到 `loaded: 3047 tokens` 提示时 | `01-before-monolith-loaded.png` |
| 2 | BEFORE · 问 revenue · 看 total input | 回答完，token 统计框出现时 | `02-before-revenue-3134tokens.png` |
| 3 | AFTER · Claude Code 启动 · skill 注册 | 启动后看到 `Skills indexed: 3` 时 | `03-after-skills-registered.png` |
| 4 | AFTER · 问 revenue · 看 skill 召回 | "MATCH: financial-analyzing (keyword: revenue)" 闪现时 | `04-after-skill-match.png` |
| 5 | AFTER · 同一回答 · 看 total input 降到 2038 | 回答完，token 统计框出现时 | `05-after-revenue-2038tokens.png` |
| 6 | AFTER · 问 CRUD endpoint · 看 financial-analyzing 未加载 | "NO MATCH: financial-analyzing" 闪现时 | `06-after-skill-no-match.png` |
| 7 | 对比卡片（最关键） | 把 02 + 05 拼一张图 BEFORE \| AFTER | `07-side-by-side-token-saving.png` |

## 截屏前准备

- 终端字号 16pt 以上
- 关闭无关 tab、隐藏 dock
- 终端配色：暗底（黑或墨绿背景）+ 高对比度
- 整窗 1280×720 抓全

## 截屏后

把 png 放进本目录，V3 PPT build 脚本会自动按文件名捡进 §4 Demo 2 的截屏 slide。
