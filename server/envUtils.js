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
 * Prefer GEMINI_API_KEY; otherwise GOOGLE_API_KEY (some docs use that name for the same AI Studio key).
 * Ignores placeholder values like your_*_here.
 */
function resolveGeminiApiKey() {
  const g = process.env.GEMINI_API_KEY;
  const o = process.env.GOOGLE_API_KEY;
  if (!isPlaceholderSecret(g)) return String(g).trim();
  if (!isPlaceholderSecret(o)) return String(o).trim();
  return null;
}

function hasGeminiKey() {
  return resolveGeminiApiKey() != null;
}

function resolveEnvPath() {
  return path.join(__dirname, '..', '.env');
}

function logEnvHint() {
  const envPath = resolveEnvPath();
  if (!fs.existsSync(envPath)) {
    console.warn(
      `[energy-navigator] No .env file found at ${envPath}\n` +
        '  Copy .env.example to .env in the project root, add GEMINI_API_KEY (and optional keys), then restart the server.'
    );
  }
}

/** Warn at startup if assessments will fail — does not print key material. */
function logGeminiKeyHint() {
  if (hasGeminiKey()) return;
  const envPath = resolveEnvPath();
  const hasFile = fs.existsSync(envPath);
  console.warn(
    '[energy-navigator] No valid Gemini API key: set GEMINI_API_KEY (or GOOGLE_API_KEY) to a real key, not the .env.example placeholder.\n' +
      '  Create a key: https://aistudio.google.com/apikey — then restart the server.\n' +
      (hasFile ? `  (Env file: ${envPath})` : '')
  );
}

module.exports = {
  isPlaceholderSecret,
  hasGeminiKey,
  resolveGeminiApiKey,
  resolveEnvPath,
  logEnvHint,
  logGeminiKeyHint,
};
