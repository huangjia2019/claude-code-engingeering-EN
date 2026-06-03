# Safety Hooks · PreToolUse Gate

> 这是 `04-hooks/` 模块的第一个 demo。展示 Hooks 设计的真正内核：**deterministic gate** —— 不靠模型自律，靠工程拦截。

## 配套理论 slide

V3 PPT §4 · Demo 4 之前的理论卡点：
- "防幻觉路径一 · Plan + Generator-Critic"（hook 即外部 critic）
- "复合错误数学 · 为什么需要工程化"

## 这个 demo 解决的痛点

> 工程师场景：让 AI 跑测试和清理临时文件 → AI 自信地执行 `rm -rf /tmp/cache` → 路径手滑写成 `rm -rf /tmp /cache` → 整台机器报废。

光靠 prompt 喊"不要删根目录"会被忽略。**Hook 是确定性的 —— Claude 想跑就先过这道 gate**。

## 文件清单

```
01-safety-hooks/
├── .claude/settings.json            # 配置 PreToolUse hook
├── scripts/block-dangerous.sh       # 拦截器实现
├── scripts/test-block-dangerous.sh  # 回归测试（16 条用例）
├── sample-target/              # 一个安全的清理目标（可放心 rm 内容）
├── walkthrough.md              # step-by-step
├── before-output.txt           # 无 hook 时 → 危险命令直接跑
└── after-output.txt            # 有 hook 时 → 被拦 + 给出原因
```

## 拦截规则（在 scripts/block-dangerous.sh 里）

| 危险模式 | 拦截原因 |
|---|---|
| `rm -rf /` 单独或 `rm -rf /<anything except $TMPDIR or ~/.cache>` | 灾难性删除 |
| `sudo` 任何 | 不在工作坊范围 |
| `curl ... \| sh` / `wget ... \| bash` | 远程脚本盲跑 |
| `> /dev/sda` 或 `dd of=/dev/...` | 设备级写入 |
| `chmod -R 777 /` | 全局权限破坏 |
| `:(){ :\|:& };:` | fork bomb |
| Git: `push --force` 到 main/master | 历史覆盖 |
| Git: `reset --hard` 带远程 ref | 本地未推送丢失 |

## 如何测试 / 触发 hook

Hook 不读命令行参数，而是从 **STDIN 收 JSON**（`{"tool_input":{"command":"..."}}`），用退出码表态：`0=放行`，`2=拦截`。三种方式由易到真：

**1. 跑回归测试（最快，覆盖全部规则）**

```bash
bash scripts/test-block-dangerous.sh   # 末尾应打印 passed=16 failed=0
```

改完 hook 先跑这个，防止改出误杀。

**2. 手动喂一条 JSON，看退出码（理解机制）**

```bash
# 危险 → 被拦，打印理由，exit=2
echo '{"tool_input":{"command":"rm -rf /"}}' | bash scripts/block-dangerous.sh; echo "exit=$?"

# 安全 → 静默放行，exit=0
echo '{"tool_input":{"command":"ls -la 2>/dev/null"}}' | bash scripts/block-dangerous.sh; echo "exit=$?"
```

**3. 在 Claude Code 里真触发（端到端）**

让 Claude 跑一条它会照做、但该被拦的命令，例如 `rm -rf /etc` 或 `git push --force origin main`，会看到：

```
PreToolUse:Bash hook error: BLOCKED by safety-hook: ...
```

> ⚠️ **坑**：如果让 Claude 跑 `rm -rf /`，它可能自己就先拒绝了，命令**根本没进 Bash 工具**，hook 在更外层没机会跑 —— 这不是 hook 失效。要测端到端，挑一条模型会照跑、但规则该拦的命令。

## 反模式

| 反模式 | 为什么不行 |
|---|---|
| 把 hook 写得太严（连 `ls /tmp` 都拦） | 工程师烦了直接 `--no-hooks` 全关 |
| 拦截理由没回写给 Claude | Claude 不知道为什么失败，原地循环 |
| Hook 脚本运行时间 > 1 秒 | 每个工具调用都延迟，用户感知明显卡顿 |
| Hook 改文件（pre 阶段静默修改命令） | 黑盒副作用 —— 用户以为跑的是 A 实际跑的是 B |
