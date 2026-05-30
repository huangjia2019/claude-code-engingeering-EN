# 截图清单 · Quality Hook 自动收尾

| 序号 | 场景 | 截屏时机 | 文件名 |
|---|---|---|---|
| 1 | BEFORE · 无 hook · 落盘的丑文件 | `cat server.js` 显示乱缩进 | `01-before-ugly-server.png` |
| 2 | AFTER · 启动 · 看 PostToolUse 已加载 | "Hooks loaded: 1 PostToolUse" | `02-after-hook-registered.png` |
| 3 | AFTER · Write 后立即看到 hook 触发 | "prettier: formatted ..." stderr 行 | `03-after-prettier-fired.png` |
| 4 | AFTER · 落盘的整齐文件 | `cat server.js` 显示 prettier 规范 | `04-after-clean-server.png` |
| 5 | AFTER · py 与 json 双语言一致 | py 跑 black + json 跑 prettier 各一帧 | `05-after-multi-language.png` |
| 6 | AFTER · 缺工具优雅降级 | "black skipped" 出现且 Claude 继续 | `06-after-graceful-degrade.png` |
| 7 | 对比拼图 | 01 + 04 拼成 BEFORE ugly \| AFTER clean | `07-side-by-side-ugly-clean.png` |
