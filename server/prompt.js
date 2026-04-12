/** Minimal cascade hints for hackathon prototype — keeps tokens low and speeds up the model. */
const CASCADE_ADDENDUM = `
Return only a JSON array (no markdown). Each object: programId (one of: heap_regular, heap_emergency, liheap, snap, medicaid, coned_eal, eap_national_grid, nyserda_weatherization, nyserda_empower, hra_home_energy, solar_for_all, heap_cooling, heap_clean_tune, heap_herr), name, qualifies, confidenceLevel (high|medium|low), alreadyEnrolled, eligibility (likely|possible|unlikely), reason, estimatedValue, estimatedAnnualBenefit (number), applicationUrl (or null), requiredDocuments (array), notes (or null). Mirror profile existingBenefits in alreadyEnrolled.
`;

function buildSystemPrompt(language) {
  const lang = language === 'es' ? 'Spanish (español)' : 'English';
  const base = `NYC energy assistance advisor. Given the household JSON profile, list programs they may qualify for.

Return ONLY valid JSON: one array starting with [. No code fences.
${CASCADE_ADDENDUM}
Respond in ${lang}.`;

  return base;
}

module.exports = { buildSystemPrompt, CASCADE_ADDENDUM };
