# Step-by-Step · Quality Hook 自动收尾

## Step 0 · 看 ugly 文件

```bash
cd ch05-hooks/02-quality-hooks
cat sample-files/ugly.js
```

```
function   add(a,b){return a+b}
const x={ foo:1,bar:2,baz   :   3 };
if(x.foo==1)console.log(  "ok" )
```

—— 缩进随便、空格乱来、缺分号。AI 自由发挥就是这样。

## Step 1 · 验证 hook 逻辑

```bash
cp sample-files/ugly.js /tmp/test.js
echo '{"tool_input":{"file_path":"/tmp/test.js"}}' | scripts/post-edit-format.sh
cat /tmp/test.js
```

输出：

```
function add(a, b) {
  return a + b;
}
const x = { foo: 1, bar: 2, baz: 3 };
if (x.foo == 1) console.log("ok");
```

整齐了。这是 hook 跑 prettier 的结果。

## Step 2 · BEFORE · 没 hook 的场景

```bash
mkdir -p /tmp/before-quality && cd /tmp/before-quality
claude
```

```
> Generate a simple Express endpoint /health that returns {"status":"ok"}. Save to server.js.
```

```
[Tool call: Write file_path=/tmp/before-quality/server.js content="..."]
✓ Tool executed successfully.
```

文件长这样（节选完整版见 [before-output.txt](before-output.txt)）：

```js
const express=require('express')
const app=express()
app.get( '/health',(req,res)=>{
res.json({status:"ok"})})
app.listen(3000)
```

—— 又是乱的。下次再让它"接着这个文件加 /version 路由"它会基于这种风格继续，**坏习惯被强化**。

## Step 3 · AFTER · 装上 hook

```bash
cd ch05-hooks/02-quality-hooks
claude
```

```
[INIT] Hooks loaded: 1 PostToolUse matching 'Edit|Write'
[INIT] Will run scripts/post-edit-format.sh after each file modification
```

```
> Generate a simple Express endpoint /health that returns {"status":"ok"}. Save to /tmp/after-quality/server.js.
```

```
[Tool call: Write file_path=/tmp/after-quality/server.js]
✓ Tool executed successfully.

[Hook PostToolUse: post-edit-format.sh]
  STDIN: {"tool_input":{"file_path":"/tmp/after-quality/server.js"}, ...}
  Detected extension: .js → format_with_prettier
  Running: npx prettier --log-level silent --write /tmp/after-quality/server.js
  STDERR: "post-edit-format: prettier: formatted /tmp/after-quality/server.js"
  Exit code: 0
```

文件落盘内容：

```js
const express = require("express");
const app = express();
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.listen(3000);
```

—— 缩进 / 引号 / 空格 / 分号全部按 prettier 默认整好。Claude 自己没意识到 hook 跑了什么（它看到 tool 成功就继续工作），但磁盘上的文件已经规范。

## Step 4 · 看格式跨语言一致

让 Claude 写一个 python 服务再写一个 json 配置：

```
> Add a Python equivalent of the same /health server to health.py. Then save the launch config to launch.json.
```

```
[Tool call: Write file_path=health.py]
✓ Tool executed successfully.
[Hook PostToolUse]
  Detected extension: .py → format_with_black
  STDERR: "post-edit-format: black: formatted /tmp/after-quality/health.py"

[Tool call: Write file_path=launch.json]
✓ Tool executed successfully.
[Hook PostToolUse]
  Detected extension: .json → format_with_prettier
  STDERR: "post-edit-format: prettier: formatted /tmp/after-quality/launch.json"
```

每种文件用每种文件该用的 formatter，**全在 30 行 bash 里**。

## Step 5 · 工具缺失的优雅降级

```
[Hook PostToolUse]
  Detected extension: .py → format_with_black
  black --version → not found
  STDERR: "post-edit-format: black skipped (not installed; run: pip install black)"
  Exit code: 0  ← 仍然 0，不阻塞主流程
```

Claude 不会被这个失败打断。这是 **quality-hook 与 safety-hook 的关键不同**：
- safety-hook = pre-tool gate，缺依赖时 fail-CLOSED（拦）
- quality-hook = post-tool polish，缺依赖时 fail-OPEN（跳过）

设计哲学：**安全是底线，质量是上线**。底线让步会出事，上线让步只是一次没扫到。

## Step 6 · 反模式 demo

故意把 hook 改坏，让它 lint 失败时 exit 2：

```bash
# 反模式版（不要用）
if ! prettier --check "$FILE_PATH"; then exit 2; fi
```

效果：

```
> Save a file.
[Tool call: Write]
✗ Hook PostToolUse blocked tool. Format violated.
> Save a file.
✗ Hook PostToolUse blocked tool. Format violated.
> Save a file.
✗ Hook PostToolUse blocked tool. Format violated.
[Claude stuck in retry loop. User confused.]
```

quality-hook 永远 exit 0，否则 hook 变成主线工作的敌人。

## Step 7 · 自检题

- **Q1**：为什么不让 Claude 直接生成规范代码，而要 hook 自动修？
  - 答：规范约束放 prompt 是软约束，会被压在 system 指令的底层稀释。Hook 是 post-condition 检查器，强制规范化
- **Q2**：自动格式化会不会让 Claude "学不会"规范代码？
  - 答：Claude 不"学"工作坊里的规范，它每次都是冷启动。规范只在你的 disk / commit 上需要稳定，AI 内部行为不需要被纠正
- **Q3**：什么时候 quality-hook 应该升级成 safety-hook（阻断）？
  - 答：当格式失败意味着代码不能运行（如 .py 缩进错 → 解析错），那其实不是 quality 而是 correctness 问题，应该走另一套 lint+test 的 pre-commit 检查，不是 hook

## 现场演示提示

`before-output.txt` / `after-output.txt` 为**示例输出(非真实截屏)**,仅用于排版讲解;现场以实跑的真实终端输出为准。
