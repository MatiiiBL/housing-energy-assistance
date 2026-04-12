import React from 'react';

const ELIGIBILITY_STYLES = {
  likely:   { label: 'Likely',   bg: '#f0fdf8', border: '#86efbf', text: '#126e52', dot: '#1D9E75' },
  possible: { label: 'Possible', bg: '#fffbeb', border: '#fde68a', text: '#92400e', dot: '#f59e0b' },
  unlikely: { label: 'Unlikely', bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280', dot: '#9ca3af' },
};

function ProgramCard({ program }) {
  const style = ELIGIBILITY_STYLES[program.eligibility] ?? ELIGIBILITY_STYLES.possible;
  const [docsOpen, setDocsOpen] = React.useState(false);

  return (
    <div
      className="rounded-xl border p-5"
      style={{ backgroundColor: style.bg, borderColor: style.border }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold text-gray-900">{program.name}</h2>
        <span
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ backgroundColor: style.border, color: style.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
          {style.label}
        </span>
      </div>

      {/* Reason */}
      <p className="text-sm text-gray-700 mb-3">{program.reason}</p>

      {/* Estimated value */}
      {program.estimatedValue && (
        <p className="text-sm font-medium mb-3" style={{ color: style.text }}>
          Est. value: {program.estimatedValue}
        </p>
      )}

      {/* Notes */}
      {program.notes && (
        <p className="text-xs text-gray-600 bg-white bg-opacity-60 rounded-lg px-3 py-2 mb-3 border border-white">
          {program.notes}
        </p>
      )}

      {/* Required documents (collapsible) */}
      {program.requiredDocuments?.length > 0 && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setDocsOpen((o) => !o)}
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: style.text }}
          >
            <svg
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: docsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            Required documents ({program.requiredDocuments.length})
          </button>
          {docsOpen && (
            <ul className="mt-2 space-y-1">
              {program.requiredDocuments.map((doc, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Apply link */}
      {program.applicationUrl && (
        <a
          href={program.applicationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1D9E75' }}
        >
          Apply Now
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

export default function ResultsView({ assessment, onStartOver }) {
  const order = { likely: 0, possible: 1, unlikely: 2 };
  const sorted = [...(assessment.programs || [])].sort(
    (a, b) => (order[a.eligibility] ?? 1) - (order[b.eligibility] ?? 1)
  );

  const likelyCount = sorted.filter((p) => p.eligibility === 'likely').length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Your Results</h1>
          {likelyCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {likelyCount} program{likelyCount !== 1 ? 's' : ''} you likely qualify for
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Start Over
        </button>
      </div>

      {/* Program cards */}
      <div className="space-y-4">
        {sorted.map((program, i) => (
          <ProgramCard key={i} program={program} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
