require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validateProfile } = require('./validate.js');
const { buildSystemPrompt } = require('./prompt.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

async function callGemini(systemPrompt, userMessage) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: systemPrompt,
  });
  const response = await model.generateContent(userMessage);
  return extractJSON(response.response.text());
}


app.post('/api/assess', async (req, res) => {
  // Validate input
  const { valid, data, errors } = validateProfile(req.body);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid input', fields: errors });
  }

  const systemPrompt = buildSystemPrompt(data.language);
  const userMessage = JSON.stringify(data, null, 2);

  // 30-second timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), 30000)
  );

  try {
    const output = await Promise.race([
      callGemini(systemPrompt, userMessage),
      timeoutPromise,
    ]);
    return res.json({ programs: output });
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      console.error('Gemini API timeout');
      return res.status(504).json({
        error: 'The assessment is taking longer than expected. Please try again.',
        code: 'TIMEOUT',
      });
    }

    console.error('Raw error:', err.status, err.statusText, err.message);
    if (err.status === 429) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
      });
    }

    console.error('Assessment error:', JSON.stringify({ status: err.status, message: err.message, details: err.errorDetails }));
    return res.status(500).json({
      error: 'Something went wrong during the assessment. Please try again.',
      code: 'SERVER_ERROR',
    });
  }
});

// Catch-all for SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Energy Navigator server running on http://localhost:${PORT}`);
});
