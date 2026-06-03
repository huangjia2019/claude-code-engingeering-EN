# Deep Walkthrough — Financial-Analyzing Skill

> 这是 `02-skills/.claude/skills/financial-analyzing/` 这个 Skill 的**深度演练**。它展示 Skills 设计的真正内核：**progressive disclosure（渐进披露）**——SKILL.md 始终加载，reference/ 子文件按需触发。

## 配套理论 slide

V3 PPT §4 · Demo 2 之前的理论卡点：
- "Skills 按需加载 · token 降本利器"
- "Context 工程 · 三层供给"（system prompt / Skills / RAG）

## 这个 Skill 的结构

```
.claude/skills/financial-analyzing/
├── SKILL.md                    # 始终加载（~500 tokens）
└── reference/
    ├── revenue.md              # 关键词 "revenue" / "sales" 触发
    ├── costs.md                # 关键词 "cost" / "expense" 触发
    └── profitability.md        # 关键词 "margin" / "ROI" 触发
```

## 核心对照 · 朴素 vs Skills

| 方案 | 系统提示恒占 tokens | 单次问"revenue"实占 tokens | 单次问 ROI 实占 tokens |
|---|---|---|---|
| 朴素 · 把所有金融知识塞 system prompt | ~3000 | 3000 | 3000 |
| **Skills · 渐进披露** | ~500 | ~500 + 800 = **1300** | ~500 + 700 = **1200** |
| 节省 | — | **57%** | **60%** |

放大到一天 100 次会话 = 节省 ≈ 17 万 tokens / 天。是德 1000 工程师 = **每天 1.7 亿 tokens 直接降本**。

## Walkthrough 流程

详见 [walkthrough.md](walkthrough.md)。

- `before-output.txt` — 朴素方案的终端片段（system prompt 内被塞满，token 浪费）· **示例输出,非真实截屏**
- `after-output.txt` — Skills 方案的终端片段（按需召回，主上下文干净）· **示例输出,非真实截屏**

## 反模式：什么时候**不**该写成 Skill

| 反模式 | 为什么不行 |
|---|---|
| 把"项目目录结构"塞 SKILL.md | 那是 CLAUDE.md 干的事 |
| 把"如何写 commit message"塞 SKILL.md | 没有触发关键词，不会被召回 |
| 把"一次性脚本"塞 SKILL.md | 直接 Bash 跑一次完事，不要污染 skill 注册表 |
| SKILL.md > 2000 tokens | 失去 progressive disclosure 价值 |
