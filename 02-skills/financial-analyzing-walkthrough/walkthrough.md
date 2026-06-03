# Step-by-Step · Financial-Analyzing Skill 渐进披露

## Step 0 · 数据预览

```bash
cd 02-skills
cat demo-project/src/data/quarterly-revenue.json | head -20
```

四季度数据：Q1→Q4 营收 $570K → $640K → $727K → $808K，客户从 285 增至 362。

## Step 1 · BEFORE · 朴素方案（无 Skills）

假设我们把所有金融分析知识硬塞 system prompt（这是工程师的常见冲动）。

```bash
# 假设的 system prompt 文件（仅演示用）
wc -w monolith-system-prompt.md
# → ~2400 words = ~3000 tokens
```

发起一次问询：

```bash
claude -p "Analyze Q4 revenue in demo-project/src/data/quarterly-revenue.json"
```

终端输出片段（见 [before-output.txt](before-output.txt) 完整版）：

```
[system prompt loaded: 3047 tokens]
[user message: 87 tokens]
[assistant response: 412 tokens]
TOTAL INPUT: 3134 tokens   ← 每次都恒载这 3047
```

**问题**：用户只问 revenue，cost / profitability 的文档全程没用上，每次会话恒占 3000 tokens。

## Step 2 · AFTER · Skills 渐进披露

启动 Claude Code 时，Claude 只读 SKILL.md 的 frontmatter（name + description），用于判断要不要召回这个 skill。

```bash
cd 02-skills
claude
```

```
[skills registered: code-reviewing, financial-analyzing, api-generating]
[skill frontmatter loaded: 3 × ~80 tokens = 240 tokens]
```

用户问：

```
> Analyze Q4 revenue in demo-project/src/data/quarterly-revenue.json
```

Claude 决策引擎判断关键词 "revenue" → 召回 `financial-analyzing` skill：

```
[skill loaded: financial-analyzing/SKILL.md - 487 tokens]
[skill scan: detected "revenue" keyword]
[reference loaded: financial-analyzing/reference/revenue.md - 812 tokens]
[user message: 87 tokens]
[assistant response: 391 tokens]
TOTAL INPUT: 1386 tokens
```

**对照**：

| 字段 | BEFORE | AFTER | 差 |
|---|---|---|---|
| System prompt | 3047 | 240 | −2807 |
| Skill 加载 | 0 | 487 + 812 = 1299 | +1299 |
| 实际 INPUT | **3134** | **1386** | **−1748 (−55.8%)** |

完整终端输出见 [after-output.txt](after-output.txt)。

## Step 3 · 观察 · 关键词不命中时 skill 不被召回

```
> Generate a CRUD endpoint for /api/users
```

```
[skill scan: matched 'api-generating' (keyword "endpoint")]
[skill scan: NO match for financial-analyzing or code-reviewing]
[skill loaded: api-generating/SKILL.md - 392 tokens]
TOTAL INPUT: 692 tokens
```

financial-analyzing 完全不进上下文 —— 这就是 progressive disclosure 的力量。

## Step 4 · 观察 · 二级 reference 也按需召回

```
> Now also analyze costs and margin for Q4
```

```
[skill already loaded: financial-analyzing/SKILL.md - 487 tokens (cached)]
[skill scan: detected "costs" + "margin" keywords]
[reference loaded: reference/costs.md - 763 tokens]
[reference loaded: reference/profitability.md - 698 tokens]
[user message: 14 tokens]
TOTAL INPUT (delta from Step 2): +1475 tokens
```

revenue.md 因为已经在上下文里复用了；新 reference 按命中加载。

## Step 5 · 自检题（讨论环节用）

- **Q1**：如果一个开发者每天问 50 次金融问题，渐进披露能省多少 token？
  - 答：50 次 × 1748 节省 ≈ 87,400 tokens / day / dev
- **Q2**：SKILL.md 的 `description` 字段写给谁看？
  - 答：写给 Claude 的决策引擎看（不是给人看）。description 越精准，召回越准
- **Q3**：什么时候 description 会"误召回"？
  - 答：描述太泛（如 "data analysis"）会被无关问句触发，反而浪费 token

## 现场演示提示

`before-output.txt` / `after-output.txt` 为**示例输出(非真实截屏)**,仅用于排版讲解;现场以实跑的真实终端输出为准。
