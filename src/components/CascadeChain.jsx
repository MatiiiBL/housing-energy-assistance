import { useState } from 'react';

function programLabel(programId, programLookup) {
  const row = programLookup.get(programId);
  if (!row) return programId;
  return row.programName ?? row.name ?? programId;
}

/**
 * @param {{ path: object[], rootTrigger: string, terminalUnlock: string, totalIncrementalValue: number, hopCount: number }} chain
 * @param {Map} programLookup — programId -> { programName?, name? }
 * @param {(key: string, vars?: object) => string} t
 */
export default function CascadeChain({ chain, programLookup, t }) {
  const [expanded, setExpanded] = useState(false);

  const nodes = [
    {
      id: chain.rootTrigger,
      label: programLabel(chain.rootTrigger, programLookup),
      isRoot: true,
      valueDelta: null,
      mechanism: null,
    },
    ...chain.path.map((step) => ({
      id: step.unlockId,
      label: programLabel(step.unlockId, programLookup),
      isRoot: false,
      valueDelta: step.annualValueDelta,
      mechanism: step.mechanism,
      applicationNote: step.applicationNote,
      legalBasis: step.legalBasis,
      confidenceLevel: step.confidenceLevel,
      sourceUrl: step.sourceUrl,
    })),
  ];

  const mechanismLabel = {
    categorical: t('cascade.mechanism.categorical'),
    automatic: t('cascade.mechanism.automatic'),
    expedited: t('cascade.mechanism.expedited'),
  };

  const mechanismColor = {
    categorical: 'bg-green-100 text-green-800',
    automatic: 'bg-blue-100 text-blue-800',
    expedited: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm print:border-gray-400 print:shadow-none">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {t('cascade.chainLabel')} · {chain.hopCount}{' '}
            {chain.hopCount === 1 ? t('cascade.unlockSingular') : t('cascade.unlockPlural')}
          </span>
          {chain.totalIncrementalValue > 0 && (
            <div className="text-green-700 font-semibold text-sm mt-0.5">
              {t('cascade.additionalValue', {
                value: `$${chain.totalIncrementalValue.toLocaleString()}`,
              })}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-blue-600 hover:underline print:hidden"
        >
          {expanded ? t('cascade.hideDetails') : t('cascade.howToClaim')}
        </button>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {nodes.map((node, i) => (
          <div key={`${node.id}-${i}`} className="flex items-center gap-1">
            <div
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
                node.isRoot
                  ? 'bg-gray-100 border-gray-300 text-gray-700'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}
            >
              {node.label}
              {node.valueDelta > 0 && (
                <span className="ml-1 text-green-600 font-semibold">
                  +${node.valueDelta.toLocaleString()}
                </span>
              )}
            </div>

            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center">
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium mb-0.5 ${
                    mechanismColor[chain.path[i]?.mechanism] ?? 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {mechanismLabel[chain.path[i]?.mechanism] ?? t('cascade.mechanism.fallback')}
                </span>
                <span className="text-gray-400 text-sm">→</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className={`mt-4 space-y-3 border-t pt-3 ${expanded ? 'block' : 'hidden'} print:!block`}
      >
          {chain.path.map((step, i) => (
            <div key={step.unlockId} className="text-sm">
              <div className="flex items-start gap-2">
                <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <div className="font-medium text-gray-800">
                    {programLabel(step.unlockId, programLookup)}
                  </div>
                  <p className="text-gray-600 text-xs mt-0.5">{step.applicationNote}</p>
                  {step.confidenceLevel === 'probable' && (
                    <p className="text-amber-600 text-xs mt-1 italic">{t('cascade.verifyNote')}</p>
                  )}
                  {step.confidenceLevel === 'check' && (
                    <p className="text-gray-500 text-xs mt-1 italic">{t('cascade.checkNote')}</p>
                  )}
                  {step.sourceUrl && (
                    <a
                      href={step.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-xs underline mt-1 block"
                    >
                      {t('cascade.officialSource')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
