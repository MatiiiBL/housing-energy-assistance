export default function ClimateImpactBanner({ programs }) {
  const coolingProgram = (programs || []).find(
    (p) => p.programId === 'heap_cooling' && (p.eligibility === 'likely' || p.eligibility === 'possible')
  );

  if (!coolingProgram) return null;

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 mb-6">
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0" aria-hidden="true">
          🌡️
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-orange-900 mb-1">
            Climate Justice Alert — Cooling Assistance Available
          </h2>
          <p className="text-sm text-orange-800 leading-relaxed">
            This household qualifies for{' '}
            <strong>HEAP Cooling Assistance</strong> — a free air conditioner or cooling
            benefit. As NYC summers intensify, heat-related illness is a growing emergency,
            disproportionately affecting low-income communities in the Bronx, Brooklyn, and Queens.
            Seniors and children are especially at risk.
          </p>
          {coolingProgram.applicationUrl && (
            <a
              href={coolingProgram.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-orange-800 underline underline-offset-2 hover:text-orange-900"
            >
              Apply for cooling assistance →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
