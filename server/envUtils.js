const fs = require('fs');
const path = require('path');

/**
 * True if value is missing or clearly a template from .env.example (not a real key).
 */
function isPlaceholderSecret(value) {
  if (value == null) return true;
  const s = String(value).trim();
  if (!s) return true;
  const lower = s.toLowerCase();
  if (lower.includes('your_') && lower.includes('_here')) return true;
  if (lower === 'changeme' || lower === 'replace_me' || lower === 'xxx') return true;
  return false;
}

/**
 * Prefer ANTHROPIC_API_KEY; otherwise CLAUDE_API_KEY.
 */
function resolveAnthropicApiKey() {
  const a = process.env.ANTHROPIC_API_KEY;
  const c = process.env.CLAUDE_API_KEY;
  if (!isPlaceholderSecret(a)) return String(a).trim();
  if (!isPlaceholderSecret(c)) return String(c).trim();
  return null;
}

function hasAnthropicKey() {
  return resolveAnthropicApiKey() != null;
}

function resolveEnvPath() {
  return path.join(__dirname, '..', '.env');
}

function logEnvHint() {
  const envPath = resolveEnvPath();
  if (!fs.existsSync(envPath)) {
    console.warn(
      `[energy-navigator] No .env file found at ${envPath}\n` +
        '  Copy .env.example to .env in the project root, add ANTHROPIC_API_KEY (and optional keys), then restart the server.'
    );
  }
}

/** Warn at startup if assessments will fail — does not print key material. */
function logAnthropicKeyHint() {
  if (hasAnthropicKey()) return;
  const envPath = resolveEnvPath();
  const hasFile = fs.existsSync(envPath);
  console.warn(
    '[energy-navigator] No valid Anthropic API key: set ANTHROPIC_API_KEY (or CLAUDE_API_KEY) to a real key, not the .env.example placeholder.\n' +
      '  Create a key: https://console.anthropic.com/ — then restart the server.\n' +
      (hasFile ? `  (Env file: ${envPath})` : '')
  );
}

module.exports = {
  isPlaceholderSecret,
  hasAnthropicKey,
  resolveAnthropicApiKey,
  resolveEnvPath,
  logEnvHint,
  logAnthropicKeyHint,
};
