# 截图清单 · Safety Hook 拦截

按此清单录一次屏 → 截关键帧 → 放本目录。

| 序号 | 场景 | 截屏时机 | 文件名 |
|---|---|---|---|
| 1 | BEFORE · 无 hook · 危险命令直接跑 | `rm -rf /` 行被绿勾"成功执行" | `01-before-no-hook-disaster.png` |
| 2 | AFTER · 启动 · 看 hook 被加载 | "Hooks loaded: 1 PreToolUse..." | `02-after-hook-registered.png` |
| 3 | AFTER · 危险命令被拦 | "BLOCKED by safety-hook" 红字闪 | `03-after-blocked-rm-slash.png` |
| 4 | AFTER · Claude 自动改正重试 | "My last command was rejected... Retrying with..." | `04-after-claude-self-correct.png` |
| 5 | AFTER · sudo / curl\|sh / force-push 三联拦截 | 三段连击 | `05-after-multiple-blocks.png` |
| 6 | 对比拼图 | 01 + 03 拼成 BEFORE 灾难 \| AFTER 拦下 | `06-side-by-side-disaster-vs-block.png` |

## 准备

- 终端 16pt 以上、配色高对比（黑底白字）
- 录屏可以用 `asciinema` 然后逐帧截
- 拦截的红字 STDERR 要可读
