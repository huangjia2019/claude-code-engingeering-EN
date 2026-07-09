#!/usr/bin/env python3
"""A code-analysis web service: FastAPI + server-sent events, streaming Claude's output."""

import json
import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from claude_agent_sdk import (
    query, ClaudeAgentOptions, AssistantMessage, ResultMessage,
)

app = FastAPI()

FOCUS_PROMPTS = {
    "security":    "Focus on security vulnerabilities: SQL injection, XSS, hardcoded secrets.",
    "performance": "Focus on performance: N+1 queries, memory leaks, missing caches.",
    "quality":     "Focus on code quality: naming, DRY, complexity, test coverage.",
    "general":     "Review comprehensively: security, performance, quality, architecture.",
}


class AnalyzeRequest(BaseModel):
    prompt: str
    focus: str = "general"


@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    options = ClaudeAgentOptions(
        model="claude-sonnet-4-6",
        max_turns=15,
        max_budget_usd=0.50,
        allowed_tools=["Read", "Grep", "Glob"],
        permission_mode="plan",
        system_prompt={
            "type": "preset",
            "preset": "claude_code",
            "append": FOCUS_PROMPTS.get(request.focus, FOCUS_PROMPTS["general"]),
        },
    )

    async def event_stream():
        async for message in query(prompt=request.prompt, options=options):
            if isinstance(message, AssistantMessage):
                for block in message.content:
                    if hasattr(block, "text"):
                        yield f"data: {json.dumps({'type': 'text', 'content': block.text})}\n\n"
            elif isinstance(message, ResultMessage):
                yield f"data: {json.dumps({'type': 'done', 'cost': message.total_cost_usd})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# uvicorn 05_web_service:app --reload
