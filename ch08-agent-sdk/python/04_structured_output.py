#!/usr/bin/env python3
"""Force the model to return data that conforms to a JSON Schema."""

import asyncio
from pydantic import BaseModel
from claude_agent_sdk import query, ClaudeAgentOptions, ResultMessage


class SecurityReport(BaseModel):
    summary: str
    issues: list[dict]        # [{severity, file, line, description}]
    risk_score: float         # 0.0 - 10.0


options = ClaudeAgentOptions(
    output_format={"type": "json_schema", "schema": SecurityReport.model_json_schema()},
    max_turns=10,
    allowed_tools=["Read", "Grep", "Glob"],
)


async def main() -> None:
    async for message in query(prompt="Conduct a security review of src/", options=options):
        if isinstance(message, ResultMessage) and message.structured_output:
            report = SecurityReport.model_validate(message.structured_output)
            print(f"Risk score: {report.risk_score}")
            for issue in report.issues:
                print(f"  [{issue['severity']}] {issue['file']}:{issue.get('line', '?')}")


if __name__ == "__main__":
    asyncio.run(main())
