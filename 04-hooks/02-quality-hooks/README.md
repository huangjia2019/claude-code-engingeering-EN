# Quality Hooks · PostToolUse Auto-Fix

> 这是 `04-hooks/` 模块的第二个 demo。Safety-hook 是**拒绝坏的**（pre, 反向 gate）；quality-hook 是**纠正不规范**（post, 正向 polish）。

## 配套理论 slide

V3 PPT §4 · Demo 4 之前的理论卡点：
- "5 大扩展机制 · 角色分工矩阵"（Hooks 在哪个象限）
- "Vibe Coding · 适用场景与边界"（让 AI 自由写，靠 hook 强制收尾）

## 这个 demo 解决的痛点

> AI 写代码喜欢混用 tab/space、漏分号、引号风格不一、JSON 没排好。每次让它"按项目规范写"靠 prompt 提醒是没用的 —— 提醒被压在底层 instruction 里很快被忽略。

**方案**：让 AI 自由写，写完每个文件后 hook **自动跑 formatter** —— 不规范就被改成规范，连 Claude 自己都看不见有 hook 介入。

## 文件清单

```
02-quality-hooks/
├── .claude/settings.json       # PostToolUse hook on Edit/Write
├── scripts/post-edit-format.sh # 调 prettier / black / shfmt
├── sample-files/               # 故意写丑的 .js / .py / .json
├── walkthrough.md
├── before-output.txt           # 无 hook → 丑文件留盘(示例输出,非真实截屏)
└── after-output.txt            # 有 hook → 写完即整齐(示例输出,非真实截屏)
```

## 支持的文件类型

| 扩展名 | 格式化工具 | 自动召唤命令 |
|---|---|---|
| `.js` / `.ts` / `.jsx` / `.tsx` | prettier | `npx prettier --write` |
| `.json` / `.jsonc` | prettier | `npx prettier --write` |
| `.py` | black | `python3 -m black -` |
| `.sh` / `.bash` | shfmt | `shfmt -w -i 2` |
| `.md` (table 自动对齐) | prettier | `npx prettier --write --prose-wrap preserve` |
| 其他 | 跳过 | — |

工具缺失时**不报错**（quality-hook 是 nice-to-have，不能挡住主线工作），只在 stderr 提示一次。

## 反模式

| 反模式 | 为什么不行 |
|---|---|
| 把 lint 失败当 block（exit 2） | quality-hook 不该断主线，应当只 polish 不 reject |
| Hook 里直接调 `git commit` 提交 format 后版本 | 偷偷增加提交 = 用户失控 |
| Format 完不告知 Claude | Claude 下次再看到文件时困惑"我刚写的不是这样啊" |
| 每次 Edit 都跑全工程 format | 几秒延迟 × 几百次工具调用 = 工作流崩溃 |
