# Energy Assistance Navigator

## Overview

A React web app that helps NYC households discover every energy assistance program they qualify for. A guided intake form collects household details, sends them to the Anthropic API via a Node/Express backend, and renders structured results cards with estimated dollar amounts, required documents, and application pathways.

**Hackathon constraint: under 6 hours.**

---

## Architecture

```
React (Vite) ──POST /api/assess──▶ Node/Express ──▶ Anthropic Messages API
                                        │                  │
                                        │            Claude Sonnet 4.6
                                        │          + web_search tool enabled
                                        │                  │
                                        ◀──JSON response───┘
```

### Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Node.js + Express, single route
- **AI**: Anthropic Messages API (`claude-sonnet-4-6`), web search tool enabled
- **Language**: English + Spanish (i18n via simple JSON dictionaries)
- **Auth**: None. Anonymous. No accounts, no cookies, no persistence.
- **Deployment**: Hackathon local or Vercel/Render for demo

---

## Program Database (Hardcoded)

The system prompt includes a static registry of all NYC energy assistance programs. Claude uses web search at query time to verify current income thresholds, application windows, and open/closed status.

### Programs to include

| # | Program | Administering Agency | Category |
|---|---------|---------------------|----------|
| 1 | HEAP Regular Benefit | OTDA via HRA | Direct payment |
| 2 | HEAP Emergency Benefit | OTDA via HRA | Emergency |
| 3 | HEAP Cooling Assistance | OTDA via HRA | Seasonal |
| 4 | HEAP Clean and Tune | OTDA via HRA | Maintenance |
| 5 | HEAP HERR (Heating Equipment Repair/Replacement) | OTDA via HRA | Equipment |
| 6 | Energy Affordability Program (EAP) | Con Edison / National Grid | Monthly discount |
| 7 | Enhanced EAP | Con Edison / National Grid | Monthly discount |
| 8 | Statewide Solar for All (S-SFA) | NYS via utility | Bill credits |
| 9 | REACH bill credits | NYS via utility | Bill credits |
| 10 | EmPower+ weatherization | NYSERDA | Home upgrades |
| 11 | Weatherization Assistance Program (WAP) | NYS HCR | Home upgrades |
| 12 | EnergyShare | Con Edison / HeartShare | Grant |
| 13 | Community Solar (low-income track) | Various providers | Bill credits |
| 14 | Lifeline (telecom, cross-qualifies) | FCC via carrier | Telecom discount |
| 15 | Utility Arrears Forgiveness | Con Edison / National Grid | Debt relief |

### Cascade chains to encode

These are the cross-program enrollment triggers the system prompt must instruct Claude to trace:

```
SNAP enrollment ──▶ HEAP categorical eligibility (no separate income verification)
HEAP grant posted ──▶ EAP auto-enrollment (18 months)
EAP enrollment + disadvantaged community ──▶ Solar for All / REACH auto-enrollment
HEAP/SNAP/Medicaid ──▶ EmPower+ eligibility
HEAP/SNAP ──▶ Lifeline eligibility
```

### Negative interactions to flag

```
Benefit income may count toward gross income for other programs
Some programs share funding pools — applying late in season risks exhaustion
WAP and EmPower+ overlap — applying to both may delay processing
Emergency HEAP requires active shutoff notice — cannot apply preemptively
```

---

## Data Model

### Intake (frontend → backend)

```typescript
interface HouseholdProfile {
  householdSize: number;           // 1-8+
  annualIncome: number;            // dollars
  borough: 'bronx' | 'brooklyn' | 'manhattan' | 'queens' | 'staten_island';
  housingType: 'renter_heat_included' | 'renter_pay_utilities' | 'homeowner' | 'public_housing';
  utilityProvider: 'con_edison' | 'national_grid' | 'nyseg' | 'other';
  monthlyEnergyBill: number;       // dollars, estimate
  existingBenefits: string[];      // ['snap', 'medicaid', 'ssi', 'tanf', 'none']
  householdMembers: {
    hasChildUnder6: boolean;
    hasSenior60Plus: boolean;
    hasDisabledMember: boolean;
  };
  language: 'en' | 'es';
}
```

### Response (backend → frontend)

```typescript
interface AssessmentResponse {
  programs: ProgramResult[];
  totalEstimatedAnnualSavings: number;
  cascadeChains: CascadeChain[];
  warnings: string[];
  disclaimer: string;
}

interface ProgramResult {
  id: string;                      // e.g. 'heap_regular'
  name: string;
  adminAgency: string;
  eligibility: 'likely' | 'possible' | 'unlikely';
  estimatedAnnualValue: number;    // dollars
  description: string;             // 1-2 sentences
  requiredDocuments: string[];
  applicationMethod: string;       // e.g. 'Online via ACCESS HRA'
  applicationUrl: string | null;
  deadline: string | null;         // e.g. 'April 10, 2026' or 'Rolling'
  autoEnrolled: boolean;           // true if triggered by another program
  triggeredBy: string | null;      // id of triggering program
  notes: string | null;            // caseworker-style tips
}

interface CascadeChain {
  trigger: string;                 // program id
  unlocks: string[];               // program ids
  description: string;
}
```

---

## API Design

### `POST /api/assess`

**Request body**: `HouseholdProfile`

**Response**: `AssessmentResponse`

**Implementation**:

1. Validate input (express-validator or zod)
2. Construct messages array with system prompt + user message containing the household profile as JSON
3. Call Anthropic Messages API with:
   - model: `claude-sonnet-4-6`
   - max_tokens: 4096
   - tools: `[{ type: "web_search_20250305", name: "web_search" }]`
   - system prompt (see below)
   - user message: serialized HouseholdProfile
4. Parse Claude's response, extract JSON from text content
5. Return parsed `AssessmentResponse` to frontend

**Error handling**:
- Anthropic API timeout (30s) → return cached/fallback response with stale data warning
- Invalid input → 400 with field-level errors
- Rate limiting → 429 with retry-after

### System Prompt (core structure)

```
You are an energy assistance eligibility analyst for New York City households.

TASK: Given a household profile, evaluate eligibility for every program in the
registry below. Return ONLY a JSON object matching the AssessmentResponse schema.
No preamble, no markdown, no explanation outside the JSON.

PROGRAM REGISTRY:
[full program list with eligibility criteria, income thresholds, 
application URLs, and documentation requirements]

CASCADE RULES:
[enrollment trigger chains]

NEGATIVE INTERACTIONS:
[benefit conflicts and warnings]

INSTRUCTIONS:
1. For each program, evaluate eligibility against the household profile.
2. Use web search to verify current income thresholds and application 
   window open/closed status for HEAP and any programs with seasonal windows.
3. Assign confidence: "likely" if all known criteria are met, "possible" 
   if some criteria are met but information is incomplete, "unlikely" if 
   a known criterion is not met.
4. Trace cascade chains — if HEAP is likely, mark EAP as auto-enrolled, etc.
5. Flag any negative interactions between programs.
6. Estimate dollar values based on household size and income tier.
7. Include required documents for each program.
8. Respond in {{ language }} (en or es).

HOUSEHOLD PROFILE:
{{ profile JSON }}
```

---

## Frontend

### Pages / Views

The app is a single page with two views, toggled by state. No router needed.

#### 1. Intake view

Six input sections, rendered sequentially. No "next step" pagination — all fields visible on one scrollable page with clear section labels.

**Section A: Household composition**
- Household size: button group (1, 2, 3, 4, 5+) — if 5+ selected, show number input
- Has child under 6: toggle
- Has member 60+: toggle
- Has disabled member: toggle

**Section B: Income**
- Annual household income: text input with dollar formatting
- Helper text: "Include all sources before taxes"

**Section C: Location & housing**
- Borough: dropdown (Bronx, Brooklyn, Manhattan, Queens, Staten Island)
- Housing type: dropdown (Renter - heat included, Renter - pay own utilities, Homeowner, Public housing)

**Section D: Utility**
- Provider: dropdown (Con Edison, National Grid, NYSEG, Other)
- Monthly energy bill estimate: range slider ($50-$500) with displayed value

**Section E: Existing benefits**
- Multi-select pill buttons: SNAP, Medicaid, SSI, TANF, None
- Selecting "None" deselects all others and vice versa

**Section F: Language**
- Toggle: English / Español
- Changing this re-renders all labels and will set the language field in the API request

**Submit button**: "Find my programs" — full width, teal (#1D9E75), white text

#### 2. Results view

**Loading state**: skeleton cards with shimmer animation. Text: "Checking [X] programs across [Y] agencies..."

**Summary bar** (top):
- Three metric cards in a row: Programs found | Est. annual savings | Cascade links found

**Info banner** (if applicable):
- Teal background. Shows the most impactful cascade insight, e.g. "Your SNAP enrollment qualifies you for HEAP without separate income verification, which triggers two additional programs automatically."

**Program cards** (main content):
- Sorted by: auto-enrolled first, then likely → possible → unlikely
- Cards connected by "enrollment triggers ↓" labels where cascades exist
- Each card contains:
  - Program name (bold) + administering agency (muted)
  - Eligibility badge: "Likely eligible" (teal) | "Possibly eligible" (amber) | "Auto-enrolled" (teal, different label)
  - Estimated annual value (bold)
  - 1-2 sentence description
  - Required documents (collapsed by default, expand on click)
  - Application method + link (if available)
  - Deadline (if applicable)
  - Caseworker tip (if available, in a subtle info box)

**Warnings section** (if applicable):
- Amber cards for negative interactions

**Disclaimer** (bottom):
- Gray text: "This is not legal or financial advice. Eligibility assessments are estimates based on publicly available program guidelines. Confirm eligibility directly with each program before applying."

**"Start over" button** — resets to intake view

---

## i18n

Simple JSON dictionary approach. No library needed for MVP.

```
/src/i18n/en.json
/src/i18n/es.json
```

Each file contains all UI strings keyed by identifier:

```json
{
  "intake.title": "Find your energy assistance programs",
  "intake.household_size": "Household size",
  "intake.submit": "Find my programs",
  "results.programs_found": "Programs found",
  "results.annual_savings": "Est. annual savings",
  "results.likely": "Likely eligible",
  "results.possible": "Possibly eligible",
  "results.auto": "Auto-enrolled",
  "results.disclaimer": "This is not legal or financial advice...",
  ...
}
```

The language toggle on the intake form sets a React state variable. All UI text renders via a `t('key')` helper function. The API response itself comes back in the selected language because the system prompt instructs Claude to respond in the chosen language.

---

## File Structure

```
energy-navigator/
├── package.json
├── vite.config.js
├── .env                          # ANTHROPIC_API_KEY
├── server/
│   ├── index.js                  # Express server, serves static + API
│   ├── prompt.js                 # System prompt builder
│   ├── programs.js               # Hardcoded program registry
│   └── validate.js               # Input validation (zod)
├── src/
│   ├── main.jsx
│   ├── App.jsx                   # Top-level state, view toggle
│   ├── components/
│   │   ├── IntakeForm.jsx        # All intake sections
│   │   ├── ResultsView.jsx       # Summary bar + cards + warnings
│   │   ├── ProgramCard.jsx       # Individual program result
│   │   ├── CascadeConnector.jsx  # "enrollment triggers ↓" label
│   │   ├── SummaryBar.jsx        # Three metric cards
│   │   ├── LanguageToggle.jsx
│   │   └── LoadingSkeleton.jsx
│   ├── i18n/
│   │   ├── en.json
│   │   └── es.json
│   ├── hooks/
│   │   └── useAssessment.js      # API call + loading/error state
│   └── styles/
│       └── index.css             # Tailwind imports + custom overrides
└── README.md
```

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
NODE_ENV=development
```

---

## Key Implementation Notes

### System prompt size
The full program registry with eligibility criteria, cascade rules, and negative interactions will be approximately 2,000-3,000 tokens. This is fine — it's a one-time input cost per request.

### Response parsing
Claude will return JSON inside its text response. The backend should:
1. Extract all text content blocks from the response
2. Strip any markdown code fences (```json ... ```)
3. Parse with `JSON.parse`
4. Validate against the `AssessmentResponse` schema
5. If parsing fails, retry once with a stricter "respond ONLY with valid JSON" prompt

### Web search behavior
The system prompt should instruct Claude to use web search specifically to:
- Verify HEAP application window is open or closed
- Check current income thresholds for the current program year
- Confirm Con Edison / National Grid specific program availability
- NOT to discover new programs (the registry is the source of truth)

### Response time
Expect 10-20 seconds due to web search tool use. The loading skeleton should feel purposeful, not broken. Show progress text like "Checking HEAP eligibility..." → "Verifying Con Edison programs..." → "Tracing enrollment chains..."

### Estimated dollar values
These are approximations based on published program guidelines. The system prompt should instruct Claude to:
- Use the household's income tier to estimate HEAP benefit amount from published tables
- Use average monthly discount percentages for EAP
- Use published community solar savings rates for Solar for All
- Always present as "Est. $X/year" not "$X/year" — the estimate framing is important

---

## Demo Script

1. Open the app. Show the clean intake form.
2. Enter: household size 4, income $38,000, Bronx, renter (pay own utilities), Con Edison, SNAP, $185/month energy bill, child under 6.
3. Hit "Find my programs." Loading state shows progress.
4. Results appear: 5 programs, $2,340 estimated annual savings.
5. Walk through the cascade: "This family applied to one program — HEAP. But because they're on SNAP, they qualified through categorical eligibility. That HEAP enrollment automatically triggered Con Edison's Energy Affordability Program. And because they're in the Bronx, which is a disadvantaged community, that EAP enrollment automatically enrolled them in Solar for All credits. One application, three programs, nearly $1,700 from the cascade alone."
6. Show the EnergyShare card with "possibly eligible" — explain the confidence tiers.
7. Expand the required documents on one card — show that the user knows exactly what to bring.
8. Toggle to Spanish — entire interface switches.
9. Close: "This family would have had to visit 15 different websites to find what we just showed them in 90 seconds."
