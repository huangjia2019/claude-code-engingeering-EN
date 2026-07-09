#!/usr/bin/env python3
"""The entry point: query() is an async generator that yields messages as they arrive."""

import asyncio
from claude_agent_sdk import query, AssistantMessage, ResultMessage


async def main() -> None:
    async for message in query(prompt="Explain the architecture of the src/ directory"):
        # Python SDK messages are dataclass instances. They have no `.type`
        # attribute — use isinstance() to discriminate.
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text, end="", flush=True)
        elif isinstance(message, ResultMessage):
            print(f"\n\nCost: ${message.total_cost_usd:.4f}  Turns: {message.num_turns}")


if __name__ == "__main__":
    asyncio.run(main())
