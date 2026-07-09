# Chapter 8 — Agent SDK: Building with Claude as the Engine

Headless mode drives Claude through *parameters*. The Agent SDK orchestrates Claude through *code*:
you own the loop, register your own tools, enforce your own permissions, and stream the result into
your own service.

## What's here

| File | What it shows |
|---|---|
| [`python/01_basic_query.py`](python/01_basic_query.py) | `query()` as an async generator; discriminating messages |
| [`python/02_options.py`](python/02_options.py) | `ClaudeAgentOptions` — model, turns, budget, tools, permission, system prompt |
| [`python/03_custom_tools.py`](python/03_custom_tools.py) | `@tool` + `create_sdk_mcp_server`, in-process MCP tools |
| [`python/04_structured_output.py`](python/04_structured_output.py) | JSON-Schema-constrained output validated with Pydantic |
| [`python/05_web_service.py`](python/05_web_service.py) | FastAPI + SSE, streaming a code review to a browser |
| [`typescript/basic.ts`](typescript/basic.ts) | The same loop in TypeScript |

## Run it

```bash
cd python
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python 01_basic_query.py

# the web service
uvicorn 05_web_service:app --reload
```

```bash
cd typescript
npm install && npm start
```

## Three API details worth memorizing

These are the ones that bite hardest, because the wrong form *looks* right.

**1. Python messages are dataclasses — there is no `.type`.**

```python
# wrong — AttributeError
if message.type == "assistant": ...

# right
if isinstance(message, AssistantMessage): ...
```

The TypeScript SDK *is* a discriminated union, so `message.type === 'assistant'` is correct there.
The two SDKs genuinely differ; don't port this line across.

**2. `@tool` takes `input_schema`, not `parameters`.**

```python
@tool(name="query_database", description="...", input_schema={"query": str, "limit": int})
```

**3. `ClaudeAgentOptions` has no `append_system_prompt` and no `no_session_persistence`, and
`mcp_servers` is a dict.**

```python
options = ClaudeAgentOptions(
    system_prompt={"type": "preset", "preset": "claude_code", "append": "..."},
    mcp_servers={"app-tools": tools_server},
)
```

The Python message union also carries more than the four core types (`SystemMessage`,
`AssistantMessage`, `UserMessage`, `ResultMessage`) — `StreamEvent` and `RateLimitEvent` exist too.
Discriminate on the types you handle and ignore the rest.
