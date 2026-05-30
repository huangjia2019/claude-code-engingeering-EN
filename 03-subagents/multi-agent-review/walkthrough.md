# Step-by-Step · Multi-Agent Review Fan-Out

## 设计目标

让 4 个 reviewer 同时看同一份代码 → 4 份不交叠的报告 → 主对话汇总。对比"单 agent 通用评审"会漏掉至少 50% 真实问题。

## Step 0 · 看故意带病的代码

```bash
cd 03-subagents/multi-agent-review
cat sample-code/checkout.js | wc -l
# → 62 行
```

这 62 行代码有意埋入：

| 维度 | 故意埋的问题数 | 难度 |
|---|---|---|
| Security | 10 (4× SQL 注入 + 硬编码密钥 + XSS + Path traversal + 弱 MD5 + 缺鉴权) | 经典 |
| Performance | 3 (N+1 query + SELECT * + 无 pagination) | 中 |
| Code Quality | 6 (deep nesting + swallowed error + magic numbers + 短名字 + 长函数 + ==) | 中 |
| Documentation | 3 (无 JSDoc × 2 + 无文件级说明) | 易 |
| **合计** | **22 处** | |

## Step 1 · BEFORE · 单 agent 通用评审

```bash
claude -p "Review sample-code/checkout.js for any issues."
```

终端输出（节选，完整见 [before-output.txt](before-output.txt)）：

```
I reviewed checkout.js. Here are the main issues:

1. Line 21 — SQL injection in user query
2. Line 11 — Hardcoded API key
3. Line 36-46 — Deep nesting in discount logic
4. Line 50 — MD5 is weak for signing
5. Line 22 — Empty catch swallows error

Total: 5 issues found.
```

**对照表**：

| 维度 | 应找出 | 单 agent 命中 | 漏率 |
|---|---|---|---|
| Security | 10 | 3 | 70% |
| Performance | 3 | 0 | 100% |
| Quality | 6 | 2 | 67% |
| Docs | 3 | 0 | 100% |
| **合计** | **22** | **5** | **77%** |

为什么漏这么多？单 agent 同时背 4 套 mental checklist，注意力被分散，倾向只报"最显眼的几个"就收手。

## Step 2 · AFTER · 4 agent 并行 fan-out

```bash
cd 03-subagents/multi-agent-review
claude
```

```
> Use security-reviewer, performance-reviewer, quality-reviewer,
  and docs-reviewer in parallel to review sample-code/checkout.js.
  Then merge findings into one prioritized table.
```

终端输出（节选，完整见 [after-output.txt](after-output.txt)）：

```
[Orchestrator] Spawning 4 sub-agents in parallel:
  ├─ security-reviewer    → reading checkout.js (tools: Read,Grep,Glob)
  ├─ performance-reviewer → reading checkout.js (tools: Read,Grep,Glob)
  ├─ quality-reviewer     → reading checkout.js (tools: Read,Grep,Glob)
  └─ docs-reviewer        → reading checkout.js (tools: Read,Grep,Glob)

[Wait] 4 sub-agents running...

[security-reviewer  ] returned 10 findings (5 CRITICAL, 3 HIGH, 2 MED)
[performance-reviewer] returned 3 findings (2 HIGH, 1 MED)
[quality-reviewer   ] returned 6 findings (3 MAJOR, 3 MINOR)
[docs-reviewer      ] returned 3 findings (2 MAJOR, 1 MINOR)

[Orchestrator] Merging 22 findings into prioritized report...
```

主对话最终汇总：

```
## Combined Review · checkout.js

CRITICAL (immediate fix needed):
- L11    Hardcoded API key                       [security]
- L21    SQL injection (user query)              [security]
- L24    SQL injection (cart query)              [security]
- L31    SQL injection (product query)           [security]
- L53    SQL injection (INSERT)                  [security]

HIGH:
- L30    N+1 query in cart enrichment loop       [performance]
- L51    XSS — unescaped user.name in HTML       [security]
- L56-59 Path traversal in /orders/export        [security]
- L9     Hardcoded DB password                   [security]
- L50    Weak MD5 signature                      [security]
- L22    SELECT * over-fetch                     [performance]
- L18    No authentication check                 [security]
- L26-49 Function too long (40+ lines, 5-level nesting) [quality]

MAJOR:
- L13,55 Missing JSDoc on exported routes        [docs]
- L41    Magic numbers 0.85/0.9/0.95             [quality]
- L22    Empty catch swallowed error             [quality]

MINOR / MED:
- L47    Cryptic field names p/q/x              [quality]
- L34    == instead of ===                       [quality]
- (file)  No module-level comment                 [docs]
- (file)  Unbounded result sets, no LIMIT         [performance]
- L18    enriched array unused                   [quality]
- L13    Missing @param/@returns                  [docs]

Total: 22 / 22 findings (100% coverage)
```

## Step 3 · 看上下文隔离的效果

```
> Show me the token spend.
```

```
Main conversation tokens consumed:
  User messages:           174 tokens
  Sub-agent summaries:     923 tokens (4 reviewers × ~230 each)
  Orchestrator response:   612 tokens
  ───────────────────────────────
  Main context total:    1,709 tokens

Sub-agent internal token spend (NOT in main context):
  security-reviewer:       3,847 tokens
  performance-reviewer:    2,234 tokens
  quality-reviewer:        3,121 tokens
  docs-reviewer:           1,892 tokens
  ───────────────────────────────
  Total isolated:         11,094 tokens

Ratio: 11,094 tokens of work, only 1,709 hit main context (15.4%).
```

**关键洞察**：每个 sub-agent 各自看了一遍代码、各自检索 grep 模式、各自推理 —— 这些 token 全部被隔离在自己的小上下文里，主对话不被污染。主对话只接到"汇总卡"。

## Step 4 · 自检题（讨论环节用）

- **Q1**：为什么不让一个 agent 跑 4 遍而要 4 个 agent 并行？
  - 答：单 agent 跑 4 遍，4 次都背着前一次的全部 token；4 个 agent 并行，各占独立上下文，wall-time 约 = 单次 review，找全率从 23% 涨到 100%
- **Q2**：4 个 agent 都 read-only，怎么让"修复"发生？
  - 答：评审 ≠ 修复。汇总后主对话决定调用 `bug-fixer`（有 Edit/Write 权限）做实际改动 —— **职责分离 + 最小权限**
- **Q3**：什么场景**不应该**用 4 agent fan-out？
  - 答：① 文件 < 100 行（启动开销 > 收益）② 4 个 description 高度重叠（diverse-lens 价值消失）③ 评审完后没人融合（4 份报告 dump 给用户 = 失去 context isolation 价值）

## 真截图清单（路径 B）

详见 [screenshots/CAPTURE.md](screenshots/CAPTURE.md)。
