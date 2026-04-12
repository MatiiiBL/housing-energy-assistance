import CascadeChain from './CascadeChain.jsx';

function buildProgramLookup(programCatalog, programs) {
  const m = new Map();
  for (const row of programCatalog || []) {
    if (row.programId) m.set(row.programId, row);
  }
  for (const p of programs || []) {
    if (p.programId && !m.has(p.programId)) {
      m.set(p.programId, { programId: p.programId, programName: p.name, name: p.name });
    }
  }
  return m;
}

export default function CascadeSummary({
  cascadeChains,
  programCatalog,
  programs,
  totalCascadeValue,
  liveEnrichment,
  t,
}) {
  if (!cascadeChains || cascadeChains.length === 0) return null;

  const programLookup = buildProgramLookup(programCatalog, programs);
  const count = cascadeChains.length;

  return (
    <section className="mb-8">
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-1">
          {t('cascade.bannerTitle')}
        </div>
        <div className="text-2xl font-bold text-green-800">
          +${totalCascadeValue.toLocaleString()}/yr
        </div>
        <p className="text-green-700 text-sm mt-1">
          {count === 1 ? t('cascade.bannerSubtitle_one', { count }) : t('cascade.bannerSubtitle_other', { count })}
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          {t('cascade.sectionTitle')}
        </h2>
        {cascadeChains.map((chain, i) => (
          <CascadeChain
            key={`${chain.rootTrigger}-${chain.terminalUnlock}-${i}`}
            chain={chain}
            programLookup={programLookup}
            t={t}
          />
        ))}
      </div>

      {liveEnrichment && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 mt-4 border border-gray-100">
          <span className="font-medium text-gray-600">{t('cascade.liveUpdate')} </span>
          {typeof liveEnrichment === 'string' ? liveEnrichment : JSON.stringify(liveEnrichment)}
        </div>
      )}
    </section>
  );
}
