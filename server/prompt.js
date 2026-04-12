/** Cascade-shaped JSON contract; labels align with assessmentLanguages.json codes. */
const LANGUAGE_NAMES = {
  en: 'English',
  es: 'Spanish',
  'zh-hans': 'Simplified Chinese',
  'zh-hant': 'Traditional Chinese',
  bn: 'Bengali',
  ru: 'Russian',
  ht: 'Haitian Creole',
  ko: 'Korean',
  ar: 'Arabic',
  fr: 'French',
  pl: 'Polish',
  ur: 'Urdu',
  tl: 'Filipino (Tagalog)',
  it: 'Italian',
  yi: 'Yiddish',
  el: 'Greek',
  hi: 'Hindi',
  pt: 'Portuguese',
  he: 'Hebrew',
  vi: 'Vietnamese',
  ja: 'Japanese',
  sq: 'Albanian',
  am: 'Amharic',
  pa: 'Punjabi',
  tr: 'Turkish',
  sw: 'Swahili',
};

const CASCADE_ADDENDUM = `
Return only a JSON array (no markdown). Each object: programId (one of: heap_regular, heap_emergency, liheap, snap, medicaid, coned_eal, eap_national_grid, nyserda_weatherization, nyserda_empower, hra_home_energy, solar_for_all, heap_cooling, heap_clean_tune, heap_herr), name, qualifies, confidenceLevel (high|medium|low), alreadyEnrolled, eligibility (likely|possible|unlikely), reason, estimatedValue, estimatedAnnualBenefit (number), applicationUrl (or null), requiredDocuments (array), notes (or null). Mirror profile existingBenefits in alreadyEnrolled.
`;

function buildSystemPrompt(language) {
  const lang = LANGUAGE_NAMES[language] ?? 'English';
  const base = `NYC energy assistance advisor. Given the household JSON profile, list programs they may qualify for.

Return ONLY valid JSON: one array starting with [. No code fences.
${CASCADE_ADDENDUM}
Respond in ${lang}.`;

  return base;
}

module.exports = { buildSystemPrompt, CASCADE_ADDENDUM, LANGUAGE_NAMES };
