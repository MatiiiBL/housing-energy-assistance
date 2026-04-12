/**
 * Cascade chains: trigger program → unlock program (categorical / automatic / expedited).
 * @see README — WattsGood cascade feature
 */

const CASCADE_CHAINS = [
  {
    triggerId: 'heap_regular',
    unlockId: 'coned_eal',
    mechanism: 'categorical',
    legalBasis:
      'Con Edison Energy Affordability Program grants categorical eligibility ' +
      'to any household that has received or been approved for HEAP in the ' +
      'current program year. No separate income verification required.',
    confidenceLevel: 'verified',
    annualValueDelta: 840,
    applicationNote:
      'Call Con Edison at 1-800-752-6633 or apply online with your HEAP ' +
      'approval letter. Enrollment is immediate upon proof of HEAP approval.',
    sourceUrl:
      'https://www.coned.com/en/accounts-billing/billing-help/energy-affordability',
  },
  {
    triggerId: 'heap_regular',
    unlockId: 'eap_national_grid',
    mechanism: 'categorical',
    legalBasis:
      "National Grid's Energy Assistance Program accepts HEAP approval as " +
      'categorical proof of income eligibility. Applies to National Grid ' +
      'gas customers in Brooklyn, Queens, and Staten Island.',
    confidenceLevel: 'verified',
    annualValueDelta: 720,
    applicationNote:
      'Present HEAP approval letter to National Grid. Call 1-718-643-4050 ' +
      'or visit a National Grid service center.',
    sourceUrl: 'https://www.nationalgridus.com/customer-assistance',
  },
  {
    triggerId: 'snap',
    unlockId: 'coned_eal',
    mechanism: 'categorical',
    legalBasis:
      'Con Edison EAL grants categorical eligibility to households actively ' +
      'enrolled in SNAP. SNAP award letter serves as sole income documentation.',
    confidenceLevel: 'verified',
    annualValueDelta: 840,
    applicationNote:
      'Provide current SNAP award letter to Con Edison. Apply online or ' +
      'by phone — no income documents required when SNAP is active.',
    sourceUrl:
      'https://www.coned.com/en/accounts-billing/billing-help/energy-affordability',
  },
  {
    triggerId: 'medicaid',
    unlockId: 'coned_eal',
    mechanism: 'categorical',
    legalBasis:
      'Active Medicaid enrollment qualifies a household for Con Edison EAL ' +
      'regardless of income documentation.',
    confidenceLevel: 'verified',
    annualValueDelta: 840,
    applicationNote: 'Provide Medicaid card or award letter to Con Edison.',
    sourceUrl:
      'https://www.coned.com/en/accounts-billing/billing-help/energy-affordability',
  },
  {
    triggerId: 'coned_eal',
    unlockId: 'solar_for_all',
    mechanism: 'expedited',
    legalBasis:
      'NYSERDA Solar for All gives enrollment priority to households already ' +
      'enrolled in a utility affordability program (EAL, ERAP, or equivalent). ' +
      'EAL enrollment satisfies the income pre-qualification requirement.',
    confidenceLevel: 'probable',
    annualValueDelta: 400,
    applicationNote:
      'Apply to NYSERDA Solar for All and reference your EAL enrollment ' +
      'number. Priority processing — typical wait reduced from 6 months to ' +
      '4–6 weeks.',
    sourceUrl: 'https://www.nyserda.ny.gov/All-Programs/Solar-for-All',
  },
  {
    triggerId: 'heap_regular',
    unlockId: 'nyserda_weatherization',
    mechanism: 'expedited',
    legalBasis:
      'HEAP approval places households at the top of the NYSERDA WAP waitlist ' +
      'as a priority population. Does not waive income screening but fast-tracks ' +
      'the home energy audit scheduling.',
    confidenceLevel: 'verified',
    annualValueDelta: 0,
    applicationNote:
      'Mention HEAP approval when contacting NYSERDA WAP at 1-866-697-3732. ' +
      'Request priority scheduling — typical wait reduced from 6–12 months.',
    sourceUrl: 'https://www.nyserda.ny.gov/All-Programs/WAP',
  },
  {
    triggerId: 'snap',
    unlockId: 'nyserda_empower',
    mechanism: 'categorical',
    legalBasis:
      'SNAP enrollment satisfies the income pre-qualification for NYSERDA ' +
      'EmPower+. Households do not need to submit additional income ' +
      'documentation when SNAP enrollment is active.',
    confidenceLevel: 'verified',
    annualValueDelta: 1100,
    applicationNote:
      'Apply to EmPower+ at nyserda.ny.gov and submit SNAP award letter ' +
      'as income documentation. No pay stubs required.',
    sourceUrl: 'https://www.nyserda.ny.gov/All-Programs/EmPower-New-York',
  },
  {
    triggerId: 'medicaid',
    unlockId: 'nyserda_empower',
    mechanism: 'categorical',
    legalBasis: 'Medicaid enrollment satisfies income pre-qualification for EmPower+.',
    confidenceLevel: 'verified',
    annualValueDelta: 1100,
    applicationNote: 'Apply to EmPower+ with Medicaid card or award letter.',
    sourceUrl: 'https://www.nyserda.ny.gov/All-Programs/EmPower-New-York',
  },
  {
    triggerId: 'heap_regular',
    unlockId: 'hra_home_energy',
    mechanism: 'automatic',
    legalBasis:
      'Households approved for HEAP through HRA are automatically screened ' +
      'for city-funded supplemental energy assistance. No separate application.',
    confidenceLevel: 'verified',
    annualValueDelta: 400,
    applicationNote:
      'No action required — HRA reviews for supplemental city funds ' +
      'automatically at time of HEAP approval.',
    sourceUrl: 'https://www.nyc.gov/site/hra/help/energy-assistance.page',
  },
  {
    triggerId: 'liheap',
    unlockId: 'heap_emergency',
    mechanism: 'expedited',
    legalBasis:
      'Households with an active LIHEAP/HEAP application on file can request ' +
      'Emergency HEAP without re-submitting documentation. The existing ' +
      'application record satisfies identity and income verification.',
    confidenceLevel: 'verified',
    annualValueDelta: 600,
    applicationNote:
      'Call 718-557-1399 and reference your existing HEAP application number. ' +
      'Emergency benefit can be added to an in-progress application.',
    sourceUrl: 'https://otda.ny.gov/programs/heap/',
  },
];

function buildCascadeMap() {
  const map = new Map();
  for (const chain of CASCADE_CHAINS) {
    if (!map.has(chain.triggerId)) map.set(chain.triggerId, []);
    map.get(chain.triggerId).push(chain);
  }
  return map;
}

/**
 * @param {string[]} qualifiedProgramIds - program / enrollment ids that apply as cascade triggers
 */
function resolveCascades(qualifiedProgramIds) {
  const ids = Array.isArray(qualifiedProgramIds)
    ? qualifiedProgramIds.filter(Boolean)
    : [];
  const map = buildCascadeMap();
  const resolved = [];
  const visited = new Set(ids);

  function walk(currentId, path, accumulatedValue) {
    const nexts = map.get(currentId) || [];
    for (const chain of nexts) {
      if (visited.has(chain.unlockId)) continue;
      visited.add(chain.unlockId);
      const newPath = [...path, chain];
      const newValue = accumulatedValue + chain.annualValueDelta;
      resolved.push({
        path: newPath,
        rootTrigger: path.length ? path[0].triggerId : currentId,
        terminalUnlock: chain.unlockId,
        totalIncrementalValue: newValue,
        hopCount: newPath.length,
      });
      walk(chain.unlockId, newPath, newValue);
    }
  }

  for (const id of ids) {
    walk(id, [], 0);
  }

  return resolved.sort((a, b) => b.totalIncrementalValue - a.totalIncrementalValue);
}

module.exports = {
  CASCADE_CHAINS,
  buildCascadeMap,
  resolveCascades,
};
