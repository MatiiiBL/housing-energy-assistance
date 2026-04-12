const { z } = require('zod');

const LINKUP_SEARCH_URL = 'https://api.linkup.so/v1/search';

const SearchBodySchema = z.object({
  query: z.string().min(1, 'query is required'),
  depth: z.enum(['standard', 'deep']).optional(),
  outputType: z.string().optional(),
  includeImages: z.boolean().optional(),
});

function parseSearchBody(body) {
  return SearchBodySchema.safeParse(body);
}

/**
 * Calls Linkup search API (same behavior as the official Python client / curl example).
 */
async function searchLinkup(params) {
  const key = process.env.LINKUP_API_KEY;
  if (!key) {
    const err = new Error('LINKUP_API_KEY is not configured');
    err.code = 'MISSING_LINKUP_KEY';
    throw err;
  }

  const depth = params.depth ?? 'standard';
  const outputType = params.outputType ?? 'searchResults';
  const includeImages = params.includeImages ?? false;

  const res = await fetch(LINKUP_SEARCH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: params.query,
      depth,
      outputType,
      includeImages: includeImages ? 'true' : 'false',
    }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const err = new Error(
      data.message || data.error || `Linkup API returned ${res.status}`
    );
    err.status = res.status;
    err.details = data;
    throw err;
  }

  return data;
}

module.exports = {
  parseSearchBody,
  searchLinkup,
};
