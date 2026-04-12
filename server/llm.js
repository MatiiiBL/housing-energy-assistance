const Anthropic = require('@anthropic-ai/sdk');
const { resolveAnthropicApiKey } = require('./envUtils.js');

function stripFences(text) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
}

function stripTrailingCommas(json) {
  return json.replace(/,\s*([}\]])/g, '$1');
}

function extractBalancedArray(raw) {
  const s = stripFences(raw);
  const start = s.indexOf('[');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === '\\') {
        escape = true;
        continue;
      }
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }
  return null;
}

function parseJsonLenient(slice) {
  return JSON.parse(stripTrailingCommas(slice.trim()));
}

function extractJSON(text) {
  const cleaned = stripFences(text);
  const attempts = [];
  const balanced = extractBalancedArray(cleaned);
  if (balanced) attempts.push(balanced);
  if (!attempts.includes(cleaned)) attempts.push(cleaned);

  let lastErr;
  for (const chunk of attempts) {
    try {
      const parsed = parseJsonLenient(chunk);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.programs)) return parsed.programs;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    } catch (e) {
      lastErr = e;
    }
  }

  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const parsed = parseJsonLenient(match[0]);
      if (Array.isArray(parsed)) return parsed;
      if (parsed?.programs) return parsed.programs;
      if (parsed?.items) return parsed.items;
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error('Could not parse model output as JSON array');
}

let anthropicClient = null;
let anthropicClientForKey = null;

function getAnthropicClient() {
  const key = resolveAnthropicApiKey();
  if (!key) {
    const err = new Error('ANTHROPIC_API_KEY (or CLAUDE_API_KEY) is not set or invalid');
    err.code = 'MISSING_ANTHROPIC_KEY';
    throw err;
  }
  if (!anthropicClient || anthropicClientForKey !== key) {
    anthropicClient = new Anthropic({ apiKey: key });
    anthropicClientForKey = key;
  }
  return anthropicClient;
}

async function callAnthropic(systemPrompt, userMessage) {
  const client = getAnthropicClient();
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
  const rawMax = Number(process.env.ANTHROPIC_MAX_OUTPUT_TOKENS);
  // Default 4096: enough for a full program array; 8192 often slows the tail of generation.
  const max_tokens =
    Number.isFinite(rawMax) && rawMax >= 1024 ? Math.min(Math.floor(rawMax), 8192) : 4096;
  const msg = await client.messages.create({
    model,
    max_tokens,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });
  const block = msg.content.find((b) => b.type === 'text');
  const text = block && block.type === 'text' ? block.text : '';
  if (!text) {
    throw new Error('Claude returned no text content');
  }
  return extractJSON(text);
}

async function runAssessmentModel(systemPrompt, userMessage) {
  return callAnthropic(systemPrompt, userMessage);
}

module.exports = {
  extractJSON,
  callAnthropic,
  runAssessmentModel,
};
