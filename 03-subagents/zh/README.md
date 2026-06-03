# 模块 3 · SubAgents 子代理 —— 分而治之

本模块演示**两种互补的 SubAgent 拓扑**,二者都跑在隔离的子上下文里——主对话只看到小结,不被中间过程的噪声污染。

- 串行流水线 demo:[../bugfix-demo/](../bugfix-demo/) + [../.claude/agents/](../.claude/agents/)
- 并行扇出 demo:[../multi-agent-review/](../multi-agent-review/)

---

## 总览

| Demo | 拓扑 | 重点 |
|---|---|---|
| `bugfix-demo/` + `bug-*` 三个 agent | **串行流水线**(定位 → 修复 → 验证) | 阶段间的**最小权限**工具门控 |
| `multi-agent-review/` | **并行扇出**(4 个评审角度同时跑) | **上下文隔离** + 多视角集成 |

核心结论:**单个全能 agent 会漏、会脏、会越权;拆成多个职责明确、权限最小的 SubAgent,既找得全,又互不污染。**

---

## Demo A · Bug 修复流水线(串行)

### 三个 agent 的职责与权限([../.claude/agents/](../.claude/agents/))

| Agent | 职责 | 允许的工具 | 口号 |
|-------|------|-----------|------|
| `bug-locator` | 找 bug | Read, Grep, Glob | "只有眼睛"——能看不能改 |
| `bug-fixer` | 改 bug | Read, Edit, Write | "只有手没有脚"——能改不能跑 |
| `bug-verifier` | 验证修复 | Read, Bash, Grep | "只有脚没有手"——能跑不能改 |

三个 agent 的工具集**故意不重叠**:定位者拿不到 Edit/Write,绝不会"顺手改一下";修复者拿不到 Bash,不会自己跑测试糊弄结果;验证者拿不到 Edit,它的"通过/失败"结论必定干净、不可能是自己改出来的。这就是**最小权限 + 职责分离**。

### demo 里埋了 3 个真 bug([../bugfix-demo/](../bugfix-demo/))

| # | 文件 | bug |
|---|---|---|
| 1 | `src/cart.ts` | 购物车总价**差一**:用了 `quantity - 1` |
| 2 | `src/discount.ts` | 百分比折扣**除以 10 而不是 100**(20% 变成了 200%) |
| 3 | `src/auth.ts` | token 比较用 `==` 而非 timing-safe 比较(时序攻击隐患) |

### 演示步骤

先确认 bug 是真的(测试会红):

```bash
cd 03-subagents/bugfix-demo
npm install
npx vitest run
```

实测输出:

```
Test Files  2 failed | 1 passed (3)
     Tests  4 failed | 17 passed (21)

 FAIL  tests/cart.test.ts     →  expected 30 to be 27 等(差一)
 FAIL  tests/discount.test.ts →  expected 160, received 0 等(折扣算错)
```

再在 `03-subagents/` 目录启动 Claude,让流水线接手:

```bash
cd 03-subagents
claude
```

输入:

> bugfix-demo 里有 bug,用户反馈购物车总价不对。用 bug 修复流水线(bug-locator → bug-fixer → bug-verifier)找出并修好。

可以观察三件事:

1. **bug-locator** 只用 Read/Grep/Glob 搜代码,给出"文件 + 行号 + 根因",**不动一行代码**;
2. **bug-fixer** 拿到定位报告后只改最少的行,**不跑测试**;
3. **bug-verifier** 跑 `vitest`,回报 PASS/FAIL,**不碰任何源文件**。

主对话自始至终很干净——子代理可能读了上千行,主对话只收到三段小结。

### 进阶练习

- `运行测试,用流水线修掉所有失败` —— 一次修完 cart + discount 两个 bug
- `折扣计算好像不对,调查并修复` —— 单独定位 discount.ts
- 数一数:整条流水线跑完,有多少"噪声 token"真正进了主对话

---

## Demo B · 多代理评审(并行扇出)

一份代码,4 个评审角度**同时**看 → 4 份互不交叠的报告 → 主对话汇总。对照"单 agent 通用评审",后者至少漏掉一半真实问题。

### 4 个评审角色([../multi-agent-review/.claude/agents/](../multi-agent-review/.claude/agents/))

```
security-reviewer.md      # 只看 SQL注入 / XSS / 硬编码密钥 / 弱加密 / 路径穿越
performance-reviewer.md   # 只看 N+1 / SELECT* / 阻塞 I/O / 无分页
quality-reviewer.md       # 只看 命名 / 嵌套 / 魔数 / 吞异常 / ==
docs-reviewer.md          # 只看 JSDoc / 类型签名 / 注释意图
```

每个 agent 的共同特征:

- **只许 `Read / Grep / Glob`**(只读——评审绝不能改代码);
- 各自看同一份代码,**互不知道**对方存在;
- description 里写死"待在自己的车道里,别管别人的事"。

### 演示步骤

```bash
cd 03-subagents/multi-agent-review
```

**Step 0 · 看故意带病的代码**(62 行,埋了 4 类问题):

```bash
cat sample-code/checkout.js
```

**Step 1 · BEFORE · 单 agent 通用评审**(展示"会漏"):

```bash
claude -p "Review sample-code/checkout.js for any issues."
```

单 agent 同时背 4 套检查清单,注意力分散,通常只报最显眼的几个就收手——典型只命中 5/22 左右。

**Step 2 · AFTER · 4 个 agent 并行扇出**:

```bash
claude
```

> 用 security-reviewer、performance-reviewer、quality-reviewer、docs-reviewer 并行评审 sample-code/checkout.js,然后把发现合并成一张按优先级排序的表。

### 实测结果

4 个角色各自命中,且**全都拒绝越界**——这正是"多视角隔离"的直接证据:

| 评审角色 | 命中 | 是否越界 |
|---|---|---|
| security | 7 严重 + 2 高 + 2 中(11) | 否:"错误处理不在我的范围内,跳过" |
| performance | 3 高 + 2 中 + 2 低(7) | 否 |
| quality | 7 major + 7 minor(14) | 否:"SQL 注入是安全问题,超出范围" |
| docs | 5 major + 4 minor(9) | 否:"没报 SQL 注入/凭据/路径穿越" |

每个 agent 都主动声明"我没管 X,因为那是别人的车道"。单个全能 agent 不会这么自律——它会把注意力摊薄到 4 个维度上,结果哪个都没看深。**专精 + 隔离 = 既找得全,又看得深。**

### 上下文隔离的效果

主对话只收到 4 份小结的汇总;每个 reviewer 各自读代码、各自 grep、各自推理的那一大堆 token,**全被隔离在它自己的子上下文里**,不进主对话。一份代码做了 4 倍的工作量,主对话却几乎没变脏。

> `before-output.txt` / `after-output.txt` 是**示例输出(用于排版讲解,非真实终端截屏)**。实跑时以真实输出为准。

---

## 反模式:什么时候**不**该扇出

| 反模式 | 原因 |
|---|---|
| 一份只有 50 行的小工具函数 | 4 个 agent 的启动开销 > 收益 |
| 4 个角色 description 高度重叠(如 4 个"质量评审") | 多视角价值消失,只剩 token 浪费 |
| 评审完不汇总,4 份小结直接 dump 给用户 | 失去上下文隔离的意义 |
| 让评审 agent 拿到 Edit/Write | 评审产物可能偷偷改文件,破坏职责分离 |

---

## 常见问题

- **为什么不让一个 agent 跑 4 遍,而要 4 个 agent 并行?**
  单 agent 跑 4 遍,每遍都背着前几遍的全部 token,而且越往后越分心;4 个 agent 并行,各占独立上下文,墙钟时间约等于单次评审,找全率却从 ~23% 涨到接近 100%。
- **4 个 agent 都只读,那"修复"怎么发生?**
  评审 ≠ 修复。汇总后由主对话决定调用有 Edit/Write 权限的 `bug-fixer` 做实际改动——职责分离 + 最小权限。
- **串行流水线和并行扇出,分别适合什么?**
  串行:后一步依赖前一步的产物(先定位才能修,先修才能验)。并行:多个角度互相独立、可同时进行(4 个评审维度互不依赖)。
