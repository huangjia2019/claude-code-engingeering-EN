# 截图清单 · Multi-Agent Fan-Out Demo

按此清单跑一次 demo，截 6-7 张关键帧放入本目录。

| 序号 | 场景 | 截屏时机 | 文件名 |
|---|---|---|---|
| 1 | BEFORE · 单 agent 通用评审请求发出 | `claude -p "Review..."` 按下回车后 | `01-before-prompt-sent.png` |
| 2 | BEFORE · 单 agent 报告 + coverage 框 | response 出完，coverage 框出现时 | `02-before-coverage-23pct.png` |
| 3 | AFTER · 4 agent fan-out spawn | "[Orchestrator] Spawning 4 sub-agents in parallel" 出现时 | `03-after-fanout-spawn.png` |
| 4 | AFTER · 4 个 reviewer 同时返回 | "[security-reviewer] FINISHED" 4 行齐刷时 | `04-after-4-reviewers-finished.png` |
| 5 | AFTER · 汇总表 22/22 | Combined Review 表完整时 | `05-after-coverage-100pct.png` |
| 6 | AFTER · context isolation 框 | "MAIN CONTEXT TOTAL: 1,709" 框出现时 | `06-after-context-isolation.png` |
| 7 | 对比拼图（最关键） | 02 + 05 拼成左右对比 23% → 100% | `07-side-by-side-coverage.png` |

## 准备

- 终端 16pt 以上
- 配色高对比（暗底白字 + reviewer 输出加色更醒目）
- 整窗 1280×720+

## 后续

把 png 放进本目录，V3 PPT build 脚本会按文件名自动嵌入 §4 Demo 3 截屏 slide。
