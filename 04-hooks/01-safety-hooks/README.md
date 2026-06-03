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
├── .claude/settings.json       # 配置 PreToolUse hook
├── scripts/block-dangerous.sh  # 拦截器实现
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

## 反模式

| 反模式 | 为什么不行 |
|---|---|
| 把 hook 写得太严（连 `ls /tmp` 都拦） | 工程师烦了直接 `--no-hooks` 全关 |
| 拦截理由没回写给 Claude | Claude 不知道为什么失败，原地循环 |
| Hook 脚本运行时间 > 1 秒 | 每个工具调用都延迟，用户感知明显卡顿 |
| Hook 改文件（pre 阶段静默修改命令） | 黑盒副作用 —— 用户以为跑的是 A 实际跑的是 B |
