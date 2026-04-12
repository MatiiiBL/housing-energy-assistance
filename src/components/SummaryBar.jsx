function MetricCard({ label, value, highlight }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
      <div
        className={`text-2xl font-bold mb-1 ${highlight ? '' : 'text-gray-900'}`}
        style={highlight ? { color: '#1D9E75' } : {}}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function SummaryBar({ assessment, t }) {
  const qualifyingCount = assessment.programs.filter(
    (p) => p.eligibility === 'likely' || p.autoEnrolled
  ).length;

  const savings = assessment.totalEstimatedAnnualSavings || 0;
  const formattedSavings =
    savings >= 1000
      ? `$${(savings / 1000).toFixed(1)}k`
      : `$${savings.toLocaleString()}`;

  const cascadeCount = (assessment.cascadeChains || []).length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <MetricCard label={t('results.programs_found')} value={qualifyingCount} />
      <MetricCard label={t('results.annual_savings')} value={formattedSavings} highlight />
      <MetricCard label={t('results.cascade_links')} value={cascadeCount} />
    </div>
  );
}
