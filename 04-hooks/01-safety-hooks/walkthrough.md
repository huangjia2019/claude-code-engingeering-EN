# Step-by-Step · Safety Hook 拦截

## Step 0 · 验证 hook 逻辑（不进 Claude Code 也能跑）

```bash
cd 04-hooks/01-safety-hooks

# 安全命令应通过（exit=0）
echo '{"tool_input":{"command":"ls -la sample-target/"}}' | scripts/block-dangerous.sh
echo "exit=$?"   # → 0

# 危险命令应被拦（exit=2 + 原因写到 stderr）
echo '{"tool_input":{"command":"rm -rf /"}}' | scripts/block-dangerous.sh
echo "exit=$?"   # → BLOCKED ... / exit=2
```

## Step 1 · BEFORE · 没装 hook 时的灾难场景

新建一个干净目录，假装是工程师本机：

```bash
mkdir -p /tmp/before-demo && cd /tmp/before-demo
mkdir -p sample-cleanup-target
echo "old" > sample-cleanup-target/log1.txt
echo "old" > sample-cleanup-target/log2.txt

claude
```

```
> Clean up the old logs in sample-cleanup-target/. The path is in /tmp/before-demo.
```

Claude 的执行（节选完整版见 [before-output.txt](before-output.txt)）：

```
[Tool call: Bash]
  command: rm -rf  sample-cleanup-target/*.txt

✓ Tool executed successfully.
```

看上去对吧？但同样的对话再来一次，Claude 这次"省事"地多打了空格：

```
[Tool call: Bash]
  command: rm -rf / sample-cleanup-target/*.txt   ← 注意 / 前的空格手滑！

✓ Tool executed successfully.
[Working...]
```

`rm -rf /` 拆出第一个 token 是根目录。**没人在中间拦截 —— 灾难发生**。

## Step 2 · AFTER · 装上 hook 的场景

把这个目录的 `.claude/settings.json` 配到 hook：

```bash
cat 04-hooks/01-safety-hooks/.claude/settings.json
```

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "$CLAUDE_PROJECT_DIR/scripts/block-dangerous.sh" }
        ]
      }
    ]
  }
}
```

启动 Claude Code，同样的对话：

```bash
cd 04-hooks/01-safety-hooks
claude
```

```
> Clean up the old logs in sample-target/. Use rm -rf if needed.
```

Claude 的尝试：

```
[Tool call: Bash]
  command: rm -rf / sample-target/*.log   ← 同样的手滑

[Hook PreToolUse: block-dangerous.sh]
  STDIN received: {"tool_input":{"command":"rm -rf / sample-target/*.log"}, ...}
  Pattern matched: rm targeting '/'
  Exit code: 2
  STDERR: "BLOCKED by safety-hook: rm targeting root '/' is never allowed."

[Claude sees the block message]

✗ My previous command was blocked by a project safety hook. I tried to
  remove with target '/', which the hook flagged. Let me retry with the
  intended path only:

[Tool call: Bash]
  command: rm -rf sample-target/*.log

✓ Tool executed successfully.
```

**关键**：
- Hook 拿到完整命令字符串
- Hook 用 exit code 2 给 Claude **失败反馈**
- Claude 看到 stderr 原因，**主动改正**重试
- 用户全程看到拦截 + 重试，**对话保持透明**

## Step 3 · 看 Claude 对各类危险的反应

完整对照见 [after-output.txt](after-output.txt)。10 类危险命令全部命中：

| 命令 | Hook 结果 | Claude 反应 |
|---|---|---|
| `sudo apt install jq` | 拦 | 改成 "I can't elevate privileges, please install jq manually" |
| `curl ... \| sh` | 拦 | 改成 "let me download first, then I'll show you the script before running" |
| `git push --force origin main` | 拦 | 改成 "let me use --force-with-lease on a non-main branch" |
| `dd if=/dev/zero of=/dev/sda` | 拦 | 改成 "I shouldn't write to block devices, what's the file path?" |
| `:(){ :\|:& };:` | 拦 | 改成 "that's a fork bomb, I won't run that" |

## Step 4 · 反模式 demo（故意把 hook 写错的坑）

`scripts/`下也演示了一个 fail-open 反例（已修复版）。原版本 hook 用 `jq` 解析 JSON，但工作坊机器没装 jq —— 整个 hook 静默失败，**所有危险命令一律放行**。

```bash
# 旧版本（已修复掉的 bug）
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command')   # jq not found → CMD="" → 全部通过
```

教训：**hook 必须 fail-closed**。当前实现里：
- python3 找不到 → 拦
- JSON 解析失败 → 拦
- 任何意外 → 拦

## Step 5 · 自检题

- **Q1**：Hook 凭什么阻止 Claude 跑命令？
  - 答：PreToolUse 在 Claude 把工具调用发给执行器**之前**触发；exit code 2 让执行器拒绝调用，并把 stderr 回写给 Claude
- **Q2**：为什么不直接在 system prompt 里说"不要 rm -rf /"？
  - 答：prompt 是软约束，模型可以忽略或被诱导忽略（prompt injection）。Hook 是硬约束，进程退出码不能被骗
- **Q3**：Hook 能改命令吗（比如把 `rm -rf /` 改成 `rm -rf /tmp`）？
  - 答：技术上可以（用 PreToolUse 改 stdout 重写命令），但**反模式** —— 静默改写让用户以为跑的是 A 实际跑的是 B。永远只拦 + 解释，不偷改

## 真截图清单（路径 B）

详见 [screenshots/CAPTURE.md](screenshots/CAPTURE.md)。
