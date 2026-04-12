# Energy Assistance Navigator (NYC)

Web app for New York City households to explore energy assistance programs. You fill out a short intake; the backend sends your answers to **Claude (Anthropic)** and returns suggested programs, rough benefit estimates, and links. **This is not eligibility advice**—always confirm rules and deadlines with official sources (e.g. [ACCESS NYC](https://access.nyc.gov/)).

## How to run it

1. **Node.js 18+**
2. `npm install`
3. Copy `.env.example` to `.env` and set at least `ANTHROPIC_API_KEY` (assessments need it). Optional: `LINKUP_API_KEY` for search enrichment.
4. `npm run dev` — API on `http://localhost:<PORT>` (default `3001`), app on `http://localhost:5173` (Vite proxies `/api`).

If port `3001` is busy, set `PORT=3002` in `.env` and restart.

**Production:** `npm run build` then `npm start` (serves the built SPA from Express). On Windows you may need to set `NODE_ENV=production` yourself when using `node server/index.js`.

## Using the app

- **App language** (header): English or Spanish for labels and chrome.
- **Preferred language for results** (form): Separate control so assistant output can follow any of the codes in `server/assessmentLanguages.json`.
- Submit the form to see program suggestions and optional cascade “unlock” chains when configured.

## Tech stack

- **Frontend:** React, Vite, Tailwind  
- **Backend:** Node.js, Express  
- **Validation:** Zod  
- **LLM:** Anthropic Claude (see `server/llm.js`, `server/prompt.js`)  
- **Optional:** Linkup API (`server/linkup.js`)

## Repo layout (short)

- `server/` — API, validation, prompts, program catalog, cascade logic  
- `src/` — React UI and `i18n/` strings  
- `test/` — e.g. `npm run test:cascade` for cascade resolver checks  

## License

See `package.json` for package metadata; add a `license` field there if you publish terms for this project.
