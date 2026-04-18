export default function ClimateImpactBanner({ programs }) {
  const coolingProgram = (programs || []).find(
    (p) => p.programId === 'heap_cooling' && (p.eligibility === 'likely' || p.eligibility === 'possible')
  );

  if (!coolingProgram) return null;

  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 mb-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-orange-900 mb-1">
          Climate Alert — Cooling Assistance Available
        </h2>
        <p className="text-sm text-orange-800 leading-relaxed">
          This household qualifies for <strong>HEAP Cooling Assistance</strong>. As NYC summers intensify,
          heat-related illness disproportionately affects low-income communities in the Bronx, Brooklyn, and Queens.
        </p>
        {coolingProgram.applicationUrl && (
          <a
            href={coolingProgram.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-orange-700 hover:text-orange-900 transition-colors"
          >
            Apply for cooling assistance
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
