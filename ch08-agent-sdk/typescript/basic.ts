// The TypeScript SDK uses a discriminated union, so `message.type` is correct here.
// (The Python SDK returns dataclasses and requires isinstance() instead.)
import { query, ClaudeAgentOptions } from '@anthropic-ai/claude-agent-sdk';

const options: ClaudeAgentOptions = {
  maxTurns: 5,
  allowedTools: ['Read', 'Grep', 'Glob'],
  systemPrompt: 'You are a code architecture analyst.',
};

async function analyzeCode() {
  for await (const message of query({
    prompt: 'Analyze the architecture of the src/auth/ directory',
    options,
  })) {
    if (message.type === 'assistant') {
      for (const block of message.message.content) {
        if (block.type === 'text') process.stdout.write(block.text);
      }
    } else if (message.type === 'result') {
      console.log(`\n\nCost: $${message.total_cost_usd.toFixed(4)}`);
    }
  }
}

analyzeCode();
