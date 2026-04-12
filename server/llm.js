const { GoogleGenerativeAI } = require('@google/generative-ai');
const { resolveGeminiApiKey } = require('./envUtils.js');

function extractJSON(text) {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  if (match) return JSON.parse(match[0]);
  return JSON.parse(cleaned);
}

let geminiClient = null;
let geminiClientForKey = null;

function getGeminiClient() {
  const key = resolveGeminiApiKey();
  if (!key) {
    const err = new Error('GEMINI_API_KEY (or GOOGLE_API_KEY) is not set or invalid');
    err.code = 'MISSING_GEMINI_KEY';
    throw err;
  }
  if (!geminiClient || geminiClientForKey !== key) {
    geminiClient = new GoogleGenerativeAI(key);
    geminiClientForKey = key;
  }
  return geminiClient;
}

async function callGemini(systemPrompt, userMessage) {
  const genAI = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
    generationConfig: {
      maxOutputTokens: 8192,
      temperature: 0.2,
    },
  });
  const result = await model.generateContent(userMessage);
  const text = result.response.text();
  return extractJSON(text);
}

/**
 * Runs the assessment prompt against Gemini (Google AI).
 */
async function runAssessmentModel(systemPrompt, userMessage) {
  return callGemini(systemPrompt, userMessage);
}

module.exports = {
  extractJSON,
  callGemini,
  runAssessmentModel,
};
