# Multi-Agent Code Review · Fan-Out + Context Isolation

> 这是 `03-subagents/` 模块的**第二个 demo**，与已有的 `bugfix-demo/`（流水线模式）互补。bugfix-demo 是**串行 pipeline**（locator → fixer → verifier）；multi-agent-review 是**并行 fan-out**（4 个评审角度同时工作）。

## 配套理论 slide

V3 PPT §4 · Demo 3 之前的理论卡点：
- "SubAgent · 上下文隔离"
- "复合错误数学 · 为什么需要工程化"
- "防幻觉路径一 · Plan + Generator-Critic"

## 4 个评审角色

```
.claude/agents/
├── security-reviewer.md      # 只看 SQL注入 / XSS / 密钥硬编码
├── performance-reviewer.md   # 只看 N+1 / 内存泄漏 / 缺缓存
├── quality-reviewer.md       # 只看 命名 / DRY / 复杂度 / 错处理
└── docs-reviewer.md          # 只看 JSDoc / 类型签名 / 注释意图
```

**每个 agent 的特征**：
- 只许 `Read / Grep / Glob`（read-only — 评审不能改代码）
- 只看一份代码文件，**不知道**其他三个 agent 的存在
- 输出严格按"风险等级 + 行号 + 修复建议"三段式

## 这个 demo 的设计内核

| 设计要素 | 体现位置 | 效果 |
|---|---|---|
| **Fan-out 并行** | 主对话发起 4 个 SubAgent 同时跑 | 一份代码 4 种视角，wall-time ≈ 单 agent |
| **Context isolation** | 4 个 agent 各占自己 ~3K 上下文 | 主对话只看到 4 份小结，不被 12K 噪声污染 |
| **Least privilege** | 全员 read-only，无 Edit/Write | 评审产物决不会偷偷改文件 |
| **Diverse-lens 共识** | 4 个角度独立 → 主对话融合 | 减少单 agent "盲点"（如 perf agent 漏 security） |

## 演练内容

详见 [walkthrough.md](walkthrough.md)。

- `sample-code/checkout.js` — 一份**故意**带 4 类不同问题的支付下单代码
- `before-output.txt` — 单 agent 通用评审（漏掉 SQL 注入 + N+1）· **示例输出,非真实截屏**
- `after-output.txt` — 4 角色并行评审（4 类问题全部命中）· **示例输出,非真实截屏**

## 反模式：什么时候**不**该 fan-out

| 反模式 | 原因 |
|---|---|
| 一份只有 50 行的小 utility 函数 | 4 个 agent 启动开销 > 收益 |
| 角色 description 高度重叠（e.g. 4 个"质量评审"角度） | Diverse-lens 价值消失，只剩 token 浪费 |
| 评审完不汇总，让 4 份小结直接 dump 给用户 | 失去 context isolation 价值 |
