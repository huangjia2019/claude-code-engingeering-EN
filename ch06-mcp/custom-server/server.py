#!/usr/bin/env python3
"""A minimal MCP server exposing two read-only tools over stdio.

Register it with:
    claude mcp add app-tools --scope project -- python "$(pwd)/server.py"
"""

import asyncio
import json
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import TextContent, Tool

app = Server("app-tools")

# An in-memory stand-in for a real database.
ORDERS = [
    {"id": 1, "customer": "acme", "total": 120.50, "status": "shipped"},
    {"id": 2, "customer": "globex", "total": 89.99, "status": "pending"},
]


@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="query_orders",
            description="Return orders, optionally filtered by status.",
            inputSchema={
                "type": "object",
                "properties": {
                    "status": {"type": "string", "description": "shipped | pending"}
                },
            },
        ),
        Tool(
            name="revenue_total",
            description="Return the total revenue across all orders.",
            inputSchema={"type": "object", "properties": {}},
        ),
    ]


@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "query_orders":
        status = arguments.get("status")
        rows = [o for o in ORDERS if not status or o["status"] == status]
        return [TextContent(type="text", text=json.dumps(rows, indent=2))]

    if name == "revenue_total":
        total = sum(o["total"] for o in ORDERS)
        return [TextContent(type="text", text=f"{total:.2f}")]

    raise ValueError(f"Unknown tool: {name}")


async def main() -> None:
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())


if __name__ == "__main__":
    asyncio.run(main())
