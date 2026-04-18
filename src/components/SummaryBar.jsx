// EPA eGRID factor for NYC (NYUP subregion): 0.386 kg CO2 per kWh
const CO2_KG_PER_KWH = 0.386;

function estimateCO2Tons(programs) {
  const qualifyingIds = new Set(
    (programs || [])
      .filter((p) => p.eligibility === 'likely' || p.qualifies === true)
      .map((p) => p.programId)
  );

  let annualKwhReduction = 0;

  // EmPower+ covers insulation, appliances, HVAC — avg 20% reduction on ~5,500 kWh baseline
  if (qualifyingIds.has('nyserda_empower')) annualKwhReduction += 1100;

  // WAP covers air sealing + insulation — avg 10% reduction
  if (qualifyingIds.has('nyserda_weatherization')) annualKwhReduction += 550;

  // Cooling efficiency: AC unit replaces fans/window units
  if (qualifyingIds.has('heap_cooling')) annualKwhReduction += 200;

  const kgCO2 = annualKwhReduction * CO2_KG_PER_KWH;
  return kgCO2 / 1000;
}

function MetricCard({ label, value, highlight, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
      <div
        className={`text-2xl font-bold mb-1 ${highlight || color ? '' : 'text-gray-900'}`}
        style={highlight ? { color: '#1D9E75' } : color ? { color } : {}}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function SummaryBar({ assessment, t }) {
  const qualifyingCount = (assessment.programs || []).filter(
    (p) => p.eligibility === 'likely' || p.qualifies === true
  ).length;

  const savings = assessment.totalEstimatedAnnualSavings || 0;
  const formattedSavings =
    savings >= 1000
      ? `$${(savings / 1000).toFixed(1)}k`
      : `$${savings.toLocaleString()}`;

  const cascadeCount = (assessment.cascadeChains || []).length;

  const co2Tons = estimateCO2Tons(assessment.programs);
  const co2Label = co2Tons > 0 ? `~${co2Tons.toFixed(1)} tons/yr` : '—';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <MetricCard label={t('results.programs_found')} value={qualifyingCount} />
      <MetricCard label={t('results.annual_savings')} value={formattedSavings} highlight />
      <MetricCard label={t('results.cascade_links')} value={cascadeCount} />
      <MetricCard label="CO₂ Avoided" value={co2Label} color="#f97316" />
    </div>
  );
}
