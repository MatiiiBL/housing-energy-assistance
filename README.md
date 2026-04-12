# Energy Assistance Navigator (NYC)

A full-stack web app that helps New York City households discover energy assistance programs they may qualify for. Users complete a short intake form (household size, income, borough, housing type, utility, existing benefits, and language). The server sends a structured profile to an LLM, which returns a JSON list of programs with eligibility hints, estimated value, links, and required documents.

**Important:** Results are informational only. Always confirm eligibility and deadlines with official program sources.

---

## Features

- **Bilingual UI** — English and Spanish copy via `src/i18n/`.
- **Validated intake** — Server-side validation with [Zod](https://zod.dev/) (`server/validate.js`).
- **Program assessment API** — `POST /api/assess` uses a system prompt (`server/prompt.js`) and returns a JSON array of program suggestions.
- **Gemini (Google AI)** — Set `GEMINI_API_KEY` in `.env` (see [Environment variables](#environment-variables)).
- **Linkup search API** — `POST /api/linkup/search` proxies to [Linkup](https://www.linkup.so/) for web search–style queries (API key required).
- **Cascade chain tracing (WattsGood)** — Static trigger→unlock graph in `server/cascades.js`, resolved after each assessment. Results show visual chains above the flat program list. Optional Linkup `sourcedAnswer` enrichment when `LINKUP_API_KEY` is set.

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Frontend | React 18, Vite 5, Tailwind CSS |
| Backend | Node.js, Express |
| Validation | Zod |
| LLMs | Google Gemini (`@google/generative-ai`) |
| Search | Linkup HTTP API (`https://api.linkup.so/v1/search`) |

---

## Repository layout

```
├── server/
│   ├── index.js      # Express app, routes, production static hosting
│   ├── llm.js        # Gemini assessment runner
│   ├── linkup.js     # Linkup search client
│   ├── prompt.js     # System prompt for assessments
│   ├── validate.js   # Request body schema for /api/assess
│   ├── programs.js   # Program catalog (ids for cascade + API `programCatalog`)
│   ├── cascades.js   # Cascade definitions + resolveCascades()
│   └── assessHelpers.js # Normalize LLM output, qualified ids, totals
├── src/
│   ├── App.jsx
│   ├── components/   # Intake form, results, loading, etc.
│   ├── hooks/        # useAssessment — calls /api/assess
│   ├── i18n/         # en.json, es.json
│   └── styles/
├── index.html
├── vite.config.js    # Dev proxy: /api → http://localhost:3001
├── package.json
└── .env.example
```

---

## Prerequisites

- **Node.js** 18 or newer (global `fetch` is used for Linkup).
- API keys as described in [Environment variables](#environment-variables).

---

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in values:

   ```bash
   cp .env.example .env
   ```

   Never commit `.env` or paste live keys into the repository. If a key was exposed, rotate it in the provider’s dashboard.

3. **Run in development**

   ```bash
   npm run dev
   ```

   This starts the API on `http://localhost:<PORT>` (default **3001**) and the Vite dev server on `http://localhost:5173`, with `/api` proxied to the backend using the same `PORT` from `.env`.

   **Port 3001 already in use (`EADDRINUSE`):** Stop the other process using that port, **or** set `PORT=3002` (or another free port) in `.env`, save, and restart `npm run dev`. The Vite proxy picks up `PORT` automatically.

4. **Open the app**

   Visit `http://localhost:5173` in the browser.

---

## Environment variables

| Variable | Required for | Description |
|----------|----------------|-------------|
| `PORT` | Server | HTTP port (default `3001`). |
| `NODE_ENV` | Build / serve | Use `production` when serving the built SPA from Express. |
| `GEMINI_API_KEY` | `/api/assess` | [Google AI Studio](https://aistudio.google.com/apikey) / Gemini API key. |
| `GOOGLE_API_KEY` | Optional | Same key as `GEMINI_API_KEY` if you already use this variable name; do not use the `.env.example` placeholder text. |
| `GEMINI_MODEL` | Optional | Model id (default `gemini-3-flash-preview`). See [Gemini models](https://ai.google.dev/gemini-api/docs/models). |
| `LINKUP_API_KEY` | `/api/linkup/search` | Bearer token from Linkup. |

---

## npm scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `concurrently` server + Vite | Local development with hot reload. |
| `dev:server` | `node --watch server/index.js` | API only. |
| `dev:client` | `vite` | Frontend only. |
| `build` | `vite build` | Outputs static assets to `dist/`. |
| `start` | Sets `NODE_ENV=production` and runs `server/index.js` | Production: API + serves `dist/`. On Windows, set `NODE_ENV=production` manually if the script fails. |
| `preview` | `vite preview` | Preview the production build (API not started). |

---

## Troubleshooting

### `EADDRINUSE` (address already in use)

The API could not bind to the port in `.env` (default **3001**) because **another process is already using it** — often a second `npm run dev`, an old Node process, or another app.

**Fix 1 — use a different port (simplest)**  
Set e.g. `PORT=3002` in `.env`, save, and restart `npm run dev`. The Vite dev proxy reads the same `.env`, so `/api` still reaches the backend.

**Fix 2 — free the port on Windows**  
In PowerShell (change `3001` if your `.env` uses another `PORT`):

```powershell
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object LocalPort, OwningProcess, State
```

Note the `OwningProcess` PID, then:

```powershell
Stop-Process -Id <PID> -Force
```

Alternatively: `netstat -ano | findstr :3001` then `taskkill /PID <pid> /F`.  
Also stop **duplicate** terminals running `npm run dev` for this repo.

---

## HTTP API

### `POST /api/assess`

Runs the eligibility-style assessment.

**Request body:** JSON matching the intake schema (see `server/validate.js` — `validateAssessRequest`), including:

- `householdSize`, `annualIncome`, `borough`, `housingType`, `utilityProvider`, `monthlyEnergyBill`
- `existingBenefits` (array)
- `householdMembers`: `{ hasChildUnder6, hasSenior60Plus, hasDisabledMember }`
- `language`: `en` | `es`

Assessments use **Gemini** on the server (default **Gemini 3 Flash** preview); the client does not select a model.

**Success:** `200` with:

- `programs` — normalized rows (`programId`, `qualifies`, `confidenceLevel`, `estimatedAnnualBenefit`, plus display fields).
- `llm` — `{ "provider": "gemini" }`.
- `cascadeChains` — ordered paths from `resolveCascades()` (trigger enrollments + qualified program ids).
- `totalBaseValue`, `totalCascadeValue`, `totalEstimatedAnnualSavings` — numbers for the UI.
- `programCatalog` — `{ programId, programName }[]` from `server/programs.js`.
- `liveEnrichment` — optional string/object from Linkup when `LINKUP_API_KEY` is set and chains exist.

**Errors:** `400` validation, `429` rate limit, `504` timeout, `500` server/configuration errors. In development (`NODE_ENV` not `production`), `500` responses may include a `debug` field with the underlying error message to help troubleshoot parse/API failures.

**Tests:** `npm run test:cascade` runs resolver checks in `test/cascades.test.js`.

---

### `POST /api/linkup/search`

Proxies to Linkup’s search endpoint (equivalent to the official Python `LinkupClient` / `curl` examples).

**Request body (JSON):**

| Field | Type | Required | Notes |
|-------|------|----------|--------|
| `query` | string | Yes | Search question or keywords. |
| `depth` | `"standard"` \| `"deep"` | No | Default `standard`. |
| `outputType` | string | No | Default `searchResults`. |
| `includeImages` | boolean | No | Default `false`. Sent to Linkup as `"true"` / `"false"`. |

**Success:** `200` with Linkup’s JSON response body.

**Errors:** `400` validation, `429` rate limit, `502` upstream failure, `503` if `LINKUP_API_KEY` is missing.

**Example (curl):**

```bash
curl -s -X POST "http://localhost:3001/api/linkup/search" \
  -H "Content-Type: application/json" \
  -d "{\"query\":\"Example question\",\"depth\":\"standard\",\"outputType\":\"searchResults\",\"includeImages\":false}"
```

(With `npm run dev`, you can use port `5173` and the same path; Vite proxies `/api` to the backend.)

---

## Production build

1. Set production env vars (including `GEMINI_API_KEY`).
2. `npm run build`
3. `npm start` (or run `node server/index.js` with `NODE_ENV=production`)

Express serves `dist/` and falls back to `index.html` for client-side routes.

---

## Disclaimer

This application does not provide legal or financial advice. Program rules change; always verify eligibility, benefits, and application steps with [ACCESS NYC](https://access.nyc.gov/), utility providers, and state or federal agencies.

---

## License

See `package.json` for the package name and version. Add a `license` field to `package.json` if you want to publish terms for this project.
