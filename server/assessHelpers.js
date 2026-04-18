const { PROGRAMS } = require('./programs.js');

/**
 * Catalog fields may be plain strings or { en, es } objects. Prefer the requested
 * locale, then en, then es, then any string value.
 */
function resolveLocalizedString(value, preferredLocale = 'en') {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    const keys = [preferredLocale, 'en', 'es'];
    for (const k of keys) {
      if (value[k] != null && typeof value[k] === 'string') return value[k];
    }
    const first = Object.values(value).find((v) => typeof v === 'string');
    return first != null ? first : '';
  }
  return String(value);
}

/**
 * Detect negative interactions between qualified programs and return warning strings.
 */
function buildWarnings(programs, profile) {
  const warnings = [];
  const qualifiedIds = new Set(
    (programs || [])
      .filter((p) => p.eligibility !== 'unlikely' && (p.qualifies || p.eligibility === 'likely'))
      .map((p) => p.programId)
  );

  if (qualifiedIds.has('nyserda_weatherization') && qualifiedIds.has('nyserda_empower')) {
    warnings.push(
      'WAP (Weatherization Assistance Program) and EmPower+ have overlapping scope. ' +
        'Applying to both simultaneously may delay processing. We recommend applying to EmPower+ first — it is faster and typically covers more measures.'
    );
  }

  if (qualifiedIds.has('heap_emergency')) {
    warnings.push(
      'HEAP Emergency Benefit requires an active utility shutoff notice. You cannot apply preemptively — ' +
        'only apply when you have received a shutoff notice from your utility provider.'
    );
  }

  if (qualifiedIds.has('heap_regular')) {
    warnings.push(
      'HEAP funding is exhausted every year before the application window closes. Apply as early as possible — typically in November when the season opens.'
    );
  }

  if (qualifiedIds.has('heap_cooling')) {
    const heatVulnerableBorough = ['bronx', 'brooklyn', 'queens'].includes(profile?.borough);
    const hasVulnerableMember =
      profile?.householdMembers?.hasSenior60Plus ||
      profile?.householdMembers?.hasChildUnder6 ||
      profile?.householdMembers?.hasDisabledMember;
    if (heatVulnerableBorough || hasVulnerableMember) {
      warnings.push(
        'HEAP Cooling Assistance is especially important for this household. Apply as soon as the summer window opens (June) — air conditioner units are distributed on a first-come, first-served basis.'
      );
    }
  }

  return warnings;
}

const NAME_HINTS = [
  [/heap.*regular|^heap\b(?!.*emergency)/i, 'heap_regular'],
  [/heap.*emergency|emergency.*heap/i, 'heap_emergency'],
  [/con edison|con ed|eal|energy affordability.*con/i, 'coned_eal'],
  [/national grid|eap.*national/i, 'eap_national_grid'],
  [/solar for all|community solar/i, 'solar_for_all'],
  [/empower\+|empower plus|nys.*empower/i, 'nyserda_empower'],
  [/weatherization|wap\b/i, 'nyserda_weatherization'],
  [/hra.*home|supplemental.*energy/i, 'hra_home_energy'],
  [/liheap|liheap/i, 'liheap'],
];

function guessProgramId(name) {
  const nameStr = resolveLocalizedString(name, 'en');
  if (!nameStr) return null;
  for (const [re, id] of NAME_HINTS) {
    if (re.test(nameStr)) return id;
  }
  return null;
}

function parseEstimatedAnnualBenefit(estimatedValue) {
  if (estimatedValue == null) return 0;
  const s = resolveLocalizedString(estimatedValue, 'en');
  if (!s) return 0;
  const range = s.match(/\$?\s*([\d,]+)\s*[–-]\s*\$?\s*([\d,]+)/);
  if (range) {
    const a = parseInt(range[1].replace(/,/g, ''), 10);
    const b = parseInt(range[2].replace(/,/g, ''), 10);
    if (!Number.isNaN(a) && !Number.isNaN(b)) return Math.round((a + b) / 2);
  }
  const one = s.match(/\$?\s*([\d,]+)/g);
  if (one && one.length) {
    const n = parseInt(one[0].replace(/[$,]/g, ''), 10);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

/**
 * Normalize LLM program rows for UI + cascade resolution.
 * @param {string} [language] — assessment output language (matches intake `language`); used to unwrap {en,es} fields if the model returns them.
 */
function normalizeProgramsFromLLM(raw, language = 'en') {
  const locale = language || 'en';
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((p, index) => {
    const eligibility = p.eligibility || 'possible';
    // eligibility:'unlikely' always overrides qualifies — prevents LLM contradictions
    // from leaking into cascade triggers and metric counts.
    const qualifies =
      eligibility !== 'unlikely' &&
      (p.qualifies === true ||
        p.confidenceLevel === 'high' ||
        (eligibility === 'likely' && p.confidenceLevel !== 'low'));
    const programId =
      p.programId || guessProgramId(p.name) || `unknown_${index}`;
    let estimatedAnnualBenefit =
      typeof p.estimatedAnnualBenefit === 'number' && !Number.isNaN(p.estimatedAnnualBenefit)
        ? p.estimatedAnnualBenefit
        : 0;
    if (!estimatedAnnualBenefit && p.estimatedValue) {
      estimatedAnnualBenefit = parseEstimatedAnnualBenefit(p.estimatedValue);
    }
    const name = resolveLocalizedString(p.name, locale);
    const estimatedValue =
      p.estimatedValue != null && p.estimatedValue !== ''
        ? resolveLocalizedString(p.estimatedValue, locale)
        : p.estimatedValue;
    const notes =
      p.notes != null && p.notes !== '' ? resolveLocalizedString(p.notes, locale) : p.notes;
    return {
      ...p,
      name,
      estimatedValue,
      notes,
      programId,
      qualifies,
      confidenceLevel:
        p.confidenceLevel ||
        (eligibility === 'likely' ? 'high' : eligibility === 'unlikely' ? 'low' : 'medium'),
      estimatedAnnualBenefit,
      alreadyEnrolled: Boolean(p.alreadyEnrolled),
    };
  });
}

function getQualifiedIdsForCascades(programs, profile) {
  const ids = new Set();
  for (const p of programs || []) {
    if (!p.programId || String(p.programId).startsWith('unknown_')) continue;
    const high =
      p.eligibility !== 'unlikely' &&
      (p.qualifies === true ||
        p.confidenceLevel === 'high' ||
        (p.eligibility === 'likely' && p.confidenceLevel !== 'low'));
    if (high) ids.add(p.programId);
    if (p.alreadyEnrolled) ids.add(p.programId);
  }
  const enrolled = profile.existingBenefits || [];
  for (const b of enrolled) {
    if (b && b !== 'none') ids.add(b);
  }
  return [...ids];
}

function sumBaseValue(programs) {
  return (programs || []).reduce((sum, p) => {
    if (!p.qualifies && p.confidenceLevel !== 'high' && p.eligibility !== 'likely') return sum;
    const v = typeof p.estimatedAnnualBenefit === 'number' ? p.estimatedAnnualBenefit : 0;
    return sum + v;
  }, 0);
}

function buildProgramCatalog(language = 'en') {
  const locale = language || 'en';
  return PROGRAMS.map((p) => ({
    programId: p.id,
    programName: resolveLocalizedString(p.name, locale),
  }));
}

module.exports = {
  resolveLocalizedString,
  guessProgramId,
  normalizeProgramsFromLLM,
  getQualifiedIdsForCascades,
  sumBaseValue,
  buildProgramCatalog,
  parseEstimatedAnnualBenefit,
  buildWarnings,
};
