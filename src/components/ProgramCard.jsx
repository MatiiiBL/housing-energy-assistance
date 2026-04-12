import { useState } from 'react';

function EligibilityBadge({ eligibility, autoEnrolled, t }) {
  if (autoEnrolled) {
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
        style={{ backgroundColor: '#1D9E75' }}
      >
        {t('results.auto')}
      </span>
    );
  }
  const config = {
    likely: {
      label: t('results.likely'),
      className: 'bg-brand-100 text-brand-700 border border-brand-200',
      style: { backgroundColor: '#dcfcee', color: '#126e52', borderColor: '#bbf7de' },
    },
    possible: {
      label: t('results.possible'),
      className: '',
      style: { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' },
    },
    unlikely: {
      label: t('results.unlikely'),
      className: '',
      style: { backgroundColor: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' },
    },
  };
  const c = config[eligibility] || config.unlikely;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full border"
      style={c.style}
    >
      {c.label}
    </span>
  );
}

export default function ProgramCard({ program, t }) {
  const [docsExpanded, setDocsExpanded] = useState(false);

  const isUnlikely = program.eligibility === 'unlikely' && !program.autoEnrolled;

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
        isUnlikely ? 'opacity-60 border-gray-200' : 'border-gray-200 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-base leading-snug">{program.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{program.adminAgency}</p>
        </div>
        <div className="flex-shrink-0">
          <EligibilityBadge
            eligibility={program.eligibility}
            autoEnrolled={program.autoEnrolled}
            t={t}
          />
        </div>
      </div>

      {/* Triggered by */}
      {program.autoEnrolled && program.triggeredBy && (
        <p className="text-xs mb-2" style={{ color: '#126e52' }}>
          {t('results.triggered_by')}: <span className="font-medium">{program.triggeredBy}</span>
        </p>
      )}

      {/* Estimated value */}
      {!isUnlikely && program.estimatedAnnualValue > 0 && (
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">
            {t('results.est_value', {
              amount: `$${program.estimatedAnnualValue.toLocaleString()}`,
            })}
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{program.description}</p>

      {/* Caseworker tip */}
      {program.notes && !isUnlikely && (
        <div
          className="rounded-lg p-3 mb-3 text-xs leading-relaxed"
          style={{ backgroundColor: '#f0fdf8', color: '#126e52' }}
        >
          <span className="font-semibold">{t('results.caseworker_tip')}: </span>
          {program.notes}
        </div>
      )}

      {/* Deadline */}
      {program.deadline && !isUnlikely && (
        <p className="text-xs text-gray-500 mb-3">
          <span className="font-medium text-gray-700">{t('results.deadline')}:</span>{' '}
          {program.deadline}
        </p>
      )}

      {/* Required documents (collapsible) */}
      {program.requiredDocuments && program.requiredDocuments.length > 0 && !isUnlikely && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setDocsExpanded((v) => !v)}
            className="text-xs font-medium flex items-center gap-1 hover:underline"
            style={{ color: '#1D9E75' }}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform ${docsExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {docsExpanded ? t('results.hide_docs') : t('results.required_docs')}
          </button>
          {docsExpanded && (
            <ul className="mt-2 space-y-1">
              {program.requiredDocuments.map((doc, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="mt-0.5 text-gray-400">•</span>
                  {doc}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Application method + link */}
      {program.applicationMethod && !isUnlikely && (
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-600 flex-1">{program.applicationMethod}</p>
          {program.applicationUrl && (
            <a
              href={program.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white flex-shrink-0 flex items-center gap-1"
              style={{ backgroundColor: '#1D9E75' }}
            >
              {t('results.apply_now')}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
