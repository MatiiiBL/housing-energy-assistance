const path = require('path');
const dotenv = require('dotenv');
const { resolveEnvPath, logEnvHint, logAnthropicKeyHint } = require('./envUtils.js');

dotenv.config({ path: resolveEnvPath() });
logEnvHint();
logAnthropicKeyHint();

const express = require('express');
const cors = require('cors');
const { validateAssessRequest } = require('./validate.js');
const { buildSystemPrompt } = require('./prompt.js');
const { runAssessmentModel } = require('./llm.js');
const { parseSearchBody, searchLinkup } = require('./linkup.js');
const { resolveCascades } = require('./cascades.js');
const {
  normalizeProgramsFromLLM,
  getQualifiedIdsForCascades,
  sumBaseValue,
  buildProgramCatalog,
} = require('./assessHelpers.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

app.post('/api/assess', async (req, res) => {
  const { valid, data, errors } = validateAssessRequest(req.body);
  if (!valid) {
    return res.status(400).json({ error: 'Invalid input', fields: errors });
  }

  const { profile } = data;
  const systemPrompt = buildSystemPrompt(profile.language);
  const userMessage = JSON.stringify(profile, null, 2);

  // Hackathon / slow-network cushion (Flash is usually fast; prompt is kept short)
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), 45000)
  );

  try {
    const output = await Promise.race([
      runAssessmentModel(systemPrompt, userMessage),
      timeoutPromise,
    ]);
    const programs = normalizeProgramsFromLLM(output);
    const allTriggerIds = getQualifiedIdsForCascades(programs, profile);
    const cascadeChains = resolveCascades(allTriggerIds);
    const totalBaseValue = sumBaseValue(programs);
    const totalCascadeValue = cascadeChains.reduce(
      (sum, c) => sum + c.totalIncrementalValue,
      0
    );

    let liveEnrichment = null;
    if (process.env.LINKUP_API_KEY && cascadeChains.length > 0) {
      const topChain = cascadeChains[0];
      try {
        const linkupRes = await fetch('https://api.linkup.so/v1/search', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.LINKUP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: `NYC ${topChain.rootTrigger} categorical eligibility ${topChain.terminalUnlock} 2025 2026`,
            depth: 'standard',
            outputType: 'sourcedAnswer',
            includeImages: 'false',
          }),
        });
        const linkupData = await linkupRes.json().catch(() => ({}));
        liveEnrichment =
          linkupData?.answer ??
          linkupData?.sourcedAnswer ??
          (typeof linkupData?.text === 'string' ? linkupData.text : null);
      } catch (e) {
        console.warn('Linkup enrichment failed:', e.message);
      }
    }

    return res.json({
      programs,
      llm: { provider: 'claude' },
      cascadeChains,
      liveEnrichment,
      totalBaseValue,
      totalCascadeValue,
      totalEstimatedAnnualSavings: totalBaseValue + totalCascadeValue,
      programCatalog: buildProgramCatalog(),
    });
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      console.error('LLM API timeout');
      return res.status(504).json({
        error: 'The assessment is taking longer than expected. Please try again.',
        code: 'TIMEOUT',
      });
    }

    if (err.code === 'MISSING_ANTHROPIC_KEY') {
      console.error('Missing ANTHROPIC_API_KEY (or CLAUDE_API_KEY) for assessment');
      const payload = {
        error: 'The assessment service is not configured. Please try again later.',
        code: 'LLM_NOT_CONFIGURED',
      };
      if (process.env.NODE_ENV !== 'production') {
        payload.debug =
          'Set ANTHROPIC_API_KEY (or CLAUDE_API_KEY) in the project root .env to a real key from https://console.anthropic.com/ — not the placeholder from .env.example — then restart the dev server.';
      }
      return res.status(500).json(payload);
    }

    console.error('Raw error:', err.status, err.statusText, err.message);
    if (err.status === 429) {
      return res.status(429).json({
        error: 'Too many requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
      });
    }

    console.error('Assessment error:', JSON.stringify({ status: err.status, message: err.message, details: err.errorDetails }));
    const payload = {
      error: 'Something went wrong during the assessment. Please try again.',
      code: 'SERVER_ERROR',
    };
    if (process.env.NODE_ENV !== 'production') {
      payload.debug = err.message;
    }
    return res.status(500).json(payload);
  }
});

app.post('/api/linkup/search', async (req, res) => {
  const parsed = parseSearchBody(req.body);
  if (!parsed.success) {
    const fields = parsed.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({ error: 'Invalid input', fields });
  }

  try {
    const data = await searchLinkup(parsed.data);
    return res.json(data);
  } catch (err) {
    if (err.code === 'MISSING_LINKUP_KEY') {
      return res.status(503).json({
        error: 'Linkup search is not configured on this server.',
        code: 'LINKUP_NOT_CONFIGURED',
      });
    }
    if (err.status === 429) {
      return res.status(429).json({
        error: 'Too many Linkup requests. Please wait and try again.',
        code: 'RATE_LIMITED',
      });
    }
    console.error('Linkup error:', err.status, err.message);
    return res.status(502).json({
      error: 'Linkup search failed. Please try again.',
      code: 'LINKUP_ERROR',
    });
  }
});

// Catch-all for SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`Energy Navigator server running on http://localhost:${PORT}`);
  console.log('LLM backend: Claude (Anthropic) — default model claude-sonnet-4-6');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `[energy-navigator] Port ${PORT} is already in use (EADDRINUSE). ` +
        'Stop the other process using this port (e.g. another `npm run dev` or `node server/index.js`), ' +
        `or set PORT to a free port in .env and restart.`
    );
  } else {
    console.error('[energy-navigator] Failed to listen:', err.code, err.message);
  }
  process.exit(1);
});
