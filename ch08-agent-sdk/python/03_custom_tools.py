#!/usr/bin/env python3
"""Custom tools via the @tool decorator, hosted in an in-process MCP server.

In-process tools are fast and simple, but coupled to this application. An
external MCP server (Chapter 6) is more portable at the cost of deployment.
"""

import asyncio
import json
from claude_agent_sdk import (
    query, tool, create_sdk_mcp_server,
    ClaudeAgentOptions, AssistantMessage, ResultMessage,
)

ORDERS = [{"id": 1, "total": 120.50, "status": "shipped"}]


# The keyword is `input_schema`, not `parameters`.
@tool(
    name="query_database",
    description="Execute a read-only SQL query on the application database",
    input_schema={"query": str, "limit": int},
)
async def query_database(args):
    sql = args["query"]
    limit = args.get("limit", 100)

    # Security critical: only SELECT statements are allowed through.
    if not sql.strip().upper().startswith("SELECT"):
        return {
            "content": [{"type": "text", "text": "Error: only SELECT queries are allowed"}],
            "isError": True,
        }

    rows = ORDERS[:limit]
    return {"content": [{"type": "text", "text": json.dumps(rows, indent=2)}]}


@tool(
    name="send_notification",
    description="Send a notification to the team Slack channel",
    input_schema={"channel": str, "message": str},
)
async def send_notification(args):
    # await slack.post_message(args["channel"], args["message"])
    return {"content": [{"type": "text", "text": f"Notification sent to #{args['channel']}"}]}


tools_server = create_sdk_mcp_server(
    name="app-tools",
    version="1.0.0",
    tools=[query_database, send_notification],
)

options = ClaudeAgentOptions(
    # mcp_servers is a dict keyed by server name, not a list.
    mcp_servers={"app-tools": tools_server},
    allowed_tools=[
        "Read", "Grep", "Glob",
        "mcp__app-tools__query_database",
        "mcp__app-tools__send_notification",
    ],
)


async def main() -> None:
    async for message in query(prompt="How many orders shipped? Then notify #ops.", options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text, end="", flush=True)
        elif isinstance(message, ResultMessage):
            print(f"\n\nCost: ${message.total_cost_usd:.4f}")


if __name__ == "__main__":
    asyncio.run(main())
