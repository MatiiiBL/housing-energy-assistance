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
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === '\\') { escape = true; continue; }
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) return s.slice(start, i + 1); }
  }
  return null;
}

function extractBalancedObject(raw) {
  const s = stripFences(raw);
  const start = s.indexOf('{');
  if (start === -1) return null;
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === '\\') { escape = true; continue; }
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return s.slice(start, i + 1); }
  }
  return null;
}

function parseJsonLenient(slice) {
  return JSON.parse(stripTrailingCommas(slice.trim()));
}

/**
 * Closes unclosed strings, brackets, and braces so a truncated JSON response
 * can be parsed partially rather than failing entirely.
 */
function repairTruncatedJson(raw) {
  const text = stripFences(raw).trimEnd();
  let inString = false;
  let escape = false;
  const stack = [];

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (c === '\\') { escape = true; continue; }
      if (c === '"') inString = false;
      continue;
    }
    if (c === '"') { inString = true; continue; }
    if (c === '{' || c === '[') stack.push(c === '{' ? '}' : ']');
    else if (c === '}' || c === ']') {
      if (stack.length > 0 && stack[stack.length - 1] === c) stack.pop();
    }
  }

  let result = text;
  if (inString) result += '"';        // close open string
  while (stack.length > 0) result += stack.pop(); // close open structures
  return result;
}

/**
 * Parses Claude's output into { programs, executiveSummary }.
 * Handles new object format, legacy array format, and truncated JSON.
 */
function parseModelOutput(text) {
  const cleaned = stripFences(text);
  const attempts = [];

  const balancedObj = extractBalancedObject(cleaned);
  if (balancedObj) attempts.push(balancedObj);

  const balancedArr = extractBalancedArray(cleaned);
  if (balancedArr) attempts.push(balancedArr);

  if (!attempts.includes(cleaned)) attempts.push(cleaned);

  function tryExtract(parsed) {
    if (Array.isArray(parsed)) return { programs: parsed, executiveSummary: null };
    if (parsed && Array.isArray(parsed.programs)) {
      return { programs: parsed.programs, executiveSummary: parsed.executiveSummary ?? null };
    }
    return null;
  }

  let lastErr;

  // Pass 1: clean attempts
  for (const chunk of attempts) {
    try {
      const result = tryExtract(parseJsonLenient(chunk));
      if (result) return result;
    } catch (e) { lastErr = e; }
  }

  // Pass 2: repair truncated JSON and retry
  for (const chunk of [cleaned, ...attempts]) {
    try {
      const repaired = repairTruncatedJson(chunk);
      const result = tryExtract(parseJsonLenient(repaired));
      if (result && result.programs.length > 0) {
        console.warn('Parsed truncated JSON response — some programs may be incomplete');
        return result;
      }
    } catch (e) { lastErr = e; }
  }

  throw lastErr || new Error('Could not parse model output as JSON');
}

// Keep extractJSON for backward compatibility
function extractJSON(text) {
  return parseModelOutput(text).programs;
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
  // 8192 to fit executiveSummary + 17 programs with description/bullets + new fields
  const max_tokens =
    Number.isFinite(rawMax) && rawMax >= 1024 ? Math.min(Math.floor(rawMax), 8192) : 8192;

  const msg = await client.messages.create({
    model,
    max_tokens,
    temperature: 0.1,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
  });

  // With web search, Claude may emit tool_use + tool_result blocks before the final text.
  // Always take the LAST text block — that is Claude's final answer.
  const textBlocks = msg.content.filter((b) => b.type === 'text');
  const text = textBlocks[textBlocks.length - 1]?.text ?? '';

  if (!text) {
    throw new Error('Claude returned no text content');
  }

  return parseModelOutput(text);
}

async function runAssessmentModel(systemPrompt, userMessage) {
  return callAnthropic(systemPrompt, userMessage);
}

module.exports = {
  extractJSON,
  parseModelOutput,
  callAnthropic,
  runAssessmentModel,
};
