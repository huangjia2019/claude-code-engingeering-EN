#!/usr/bin/env python3
"""ClaudeAgentOptions: the knobs that shape a run."""

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage

options = ClaudeAgentOptions(
    model="claude-sonnet-4-6",
    max_turns=10,
    max_budget_usd=0.50,

    # Tools + permission
    allowed_tools=["Read", "Grep", "Glob"],
    permission_mode="plan",           # read-only planning mode

    # Prompt engineering. To extend Claude Code's own system prompt, pass the
    # preset form. There is no `append_system_prompt` parameter.
    system_prompt={
        "type": "preset",
        "preset": "claude_code",
        "append": "Be sure to check for SQL injection vulnerabilities.",
    },

    # Environment
    cwd="./",
    env={"PROJECT_NAME": "MyApp"},
)


async def main() -> None:
    async for message in query(prompt="Review src/ for security issues", options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text, end="", flush=True)
        elif isinstance(message, ResultMessage):
            print(f"\n\nCost: ${message.total_cost_usd:.4f}")


if __name__ == "__main__":
    asyncio.run(main())
