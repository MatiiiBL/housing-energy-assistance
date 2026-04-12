import SummaryBar from './SummaryBar.jsx';
import ProgramCard from './ProgramCard.jsx';
import CascadeConnector from './CascadeConnector.jsx';

function sortPrograms(programs) {
  const order = { auto: 0, likely: 1, possible: 2, unlikely: 3 };
  return [...programs].sort((a, b) => {
    const aKey = a.autoEnrolled ? 'auto' : a.eligibility;
    const bKey = b.autoEnrolled ? 'auto' : b.eligibility;
    return (order[aKey] ?? 3) - (order[bKey] ?? 3);
  });
}

export default function ResultsView({ assessment, onStartOver, t }) {
  const sorted = sortPrograms(assessment.programs || []);

  // Build a trigger map: triggerId → set of unlocked program ids
  const triggerMap = {};
  (assessment.cascadeChains || []).forEach((chain) => {
    if (!triggerMap[chain.trigger]) triggerMap[chain.trigger] = new Set();
    chain.unlocks.forEach((id) => triggerMap[chain.trigger].add(id));
  });

  // Best cascade chain description for the banner
  const bestChain = (assessment.cascadeChains || []).reduce(
    (best, chain) => (chain.unlocks.length > (best?.unlocks?.length ?? -1) ? chain : best),
    null
  );

  const likelyOrAuto = sorted.filter(
    (p) => p.eligibility === 'likely' || p.autoEnrolled
  );

  return (
    <div>
      {/* Title + start over */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('results.title')}</h1>
        <button
          type="button"
          onClick={onStartOver}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('results.start_over')}
        </button>
      </div>

      {/* Summary bar */}
      <SummaryBar assessment={assessment} t={t} />

      {/* Cascade insight banner */}
      {bestChain && bestChain.unlocks.length > 0 && (
        <div
          className="rounded-xl p-4 mb-6 border"
          style={{ backgroundColor: '#f0fdf8', borderColor: '#86efbf' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: '#1D9E75' }}
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#126e52' }}>
                {t('results.cascade_banner_title')}
              </p>
              <p className="text-sm" style={{ color: '#178a65' }}>
                {bestChain.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Program cards */}
      <div className="space-y-1">
        {sorted.map((program, idx) => {
          const prevProgram = idx > 0 ? sorted[idx - 1] : null;
          // Show cascade connector if previous program triggers this one
          const showConnector =
            prevProgram &&
            program.triggeredBy &&
            triggerMap[program.triggeredBy]?.has(program.id) &&
            (prevProgram.id === program.triggeredBy ||
              (prevProgram.autoEnrolled && prevProgram.triggeredBy === program.triggeredBy));

          return (
            <div key={program.id}>
              {showConnector && <CascadeConnector t={t} />}
              <ProgramCard program={program} t={t} />
            </div>
          );
        })}
      </div>

      {/* Warnings */}
      {assessment.warnings && assessment.warnings.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            {t('results.warnings_title')}
          </h2>
          <div className="space-y-2">
            {assessment.warnings.map((warning, i) => (
              <div
                key={i}
                className="rounded-lg p-3 border text-sm"
                style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' }}
              >
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    style={{ color: '#d97706' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {warning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 leading-relaxed">{assessment.disclaimer || t('results.disclaimer')}</p>
      </div>

      {/* Start over */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {t('results.start_over')}
        </button>
      </div>
    </div>
  );
}
