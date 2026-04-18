import React, { useState } from 'react';
import CascadeSummary from './CascadeSummary.jsx';
import ClimateImpactBanner from './ClimateImpactBanner.jsx';

const CO2_KG_PER_KWH = 0.386;

function estimateCO2Tons(programs) {
  const ids = new Set(
    (programs || [])
      .filter((p) => p.eligibility === 'likely' || p.qualifies === true)
      .map((p) => p.programId)
  );
  let kwh = 0;
  if (ids.has('nyserda_empower')) kwh += 1100;
  if (ids.has('nyserda_weatherization')) kwh += 550;
  if (ids.has('heap_cooling')) kwh += 200;
  return (kwh * CO2_KG_PER_KWH) / 1000;
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const Icons = {
  Grid: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Dollar: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  ),
  Link: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Leaf: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 3L9 15M9 15C9 15 3 9 3 15c0 4.5 4 7 6 7 3 0 6-2 6-5 0-2-2-5-6-7z" />
    </svg>
  ),
  ChevronRight: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  ChevronDown: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Print: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  Back: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Warning: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  Doc: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  External: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
};

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({ Icon, label, value, gradient, sub }) {
  return (
    <div className={`rounded-2xl p-5 text-white relative overflow-hidden ${gradient}`}>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 rounded-full bg-white/5" />
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <Icons.ChevronRight className="w-4 h-4 text-white/25" />
      </div>
      <div className="text-3xl font-bold leading-none mb-0.5">{value}</div>
      <div className="text-white/65 text-xs font-medium mt-1">{label}</div>
      {sub && <div className="text-white/45 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER = {
  likely: {
    label: 'Likely',
    border: 'border-l-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-500',
    valueColor: 'text-emerald-700',
    sectionDot: 'bg-emerald-500',
    sectionLabel: 'Likely Eligible',
  },
  possible: {
    label: 'Possible',
    border: 'border-l-amber-400',
    badge: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
    valueColor: 'text-amber-700',
    sectionDot: 'bg-amber-400',
    sectionLabel: 'Possibly Eligible',
  },
  unlikely: {
    label: 'Unlikely',
    border: 'border-l-slate-300',
    badge: 'bg-slate-50 text-slate-500 border border-slate-200',
    dot: 'bg-slate-300',
    valueColor: 'text-slate-400',
    sectionDot: 'bg-slate-300',
    sectionLabel: 'Unlikely Eligible',
  },
};

// ── Full-width horizontal Program Card ────────────────────────────────────────

function ProgramCard({ program }) {
  const [docsOpen, setDocsOpen] = useState(false);
  const tier = TIER[program.eligibility] ?? TIER.possible;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${tier.border} shadow-sm hover:shadow-md transition-all duration-150`}>
      <div className="p-5">
        {/* Row 1: name · badge · value */}
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex-1 min-w-0">{program.name}</h3>
          <span className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${tier.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
            {tier.label}
          </span>
          {program.estimatedValue && (
            <span className={`flex-shrink-0 text-sm font-bold ${tier.valueColor} pl-2 border-l border-slate-100`}>
              {program.estimatedValue}
            </span>
          )}
        </div>

        {/* Row 2: reason (left) · actions (right) */}
        <div className="flex items-start gap-6">
          {/* Reason + notes */}
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-sm text-slate-500 leading-relaxed">{program.reason}</p>
            {program.notes && (
              <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-500 leading-relaxed">{program.notes}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex-shrink-0 flex flex-col items-end gap-2 pt-0.5">
            {program.requiredDocuments?.length > 0 && (
              <button
                type="button"
                onClick={() => setDocsOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap"
              >
                <Icons.Doc className="w-3.5 h-3.5" />
                {docsOpen ? 'Hide docs' : `Documents (${program.requiredDocuments.length})`}
              </button>
            )}
            {program.applicationUrl && (
              <a
                href={program.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Apply Now
                <Icons.External className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Docs expanded */}
      {docsOpen && program.requiredDocuments?.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-3">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
            {program.requiredDocuments.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Program Section ───────────────────────────────────────────────────────────

function ProgramSection({ tier, programs }) {
  const cfg = TIER[tier] ?? TIER.possible;
  if (!programs.length) return null;
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${cfg.sectionDot}`} />
        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{cfg.sectionLabel}</span>
        <span className="text-xs text-slate-400">({programs.length})</span>
      </div>
      <div className="space-y-3">
        {programs.map((p, i) => <ProgramCard key={p.programId || i} program={p} />)}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function ResultsView({ assessment, onStartOver, t = (k) => k }) {
  const [showCascades, setShowCascades] = useState(false);

  const programs = assessment.programs || [];
  const likelyPrograms   = programs.filter((p) => p.eligibility === 'likely');
  const possiblePrograms = programs.filter((p) => p.eligibility === 'possible');
  const unlikelyPrograms = programs.filter((p) => p.eligibility === 'unlikely');

  const totalAnnual =
    assessment.totalEstimatedAnnualSavings ??
    (assessment.totalBaseValue ?? 0) + (assessment.totalCascadeValue ?? 0);
  const tc = assessment.totalCascadeValue ?? 0;
  const cascadeCount = (assessment.cascadeChains || []).length;
  const warnings = assessment.warnings || [];

  const formattedSavings =
    totalAnnual >= 1000 ? `$${(totalAnnual / 1000).toFixed(1)}k` : `$${totalAnnual.toLocaleString()}`;

  const co2Tons = estimateCO2Tons(programs);
  const co2Label = co2Tons > 0 ? `~${co2Tons.toFixed(1)} t` : '—';

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onStartOver}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Icons.Back className="w-4 h-4" />
          Start over
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Icons.Print className="w-4 h-4" />
          Save PDF
        </button>
      </div>

      {/* Page title */}
      <div className="mb-6">
        <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Results</p>
        <h1 className="text-2xl font-bold text-slate-900">Your Energy Assistance Summary</h1>
        <p className="text-slate-500 text-sm mt-1">
          {likelyPrograms.length} program{likelyPrograms.length !== 1 ? 's' : ''} you likely qualify for
          &nbsp;·&nbsp; NYC energy assistance programs
        </p>
      </div>

      {/* Climate banner */}
      <ClimateImpactBanner programs={programs} />

      {/* Metric cards — 4 across */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          Icon={Icons.Grid}
          label="Programs Qualifying"
          value={likelyPrograms.length}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          sub={`${programs.length} total checked`}
        />
        <MetricCard
          Icon={Icons.Dollar}
          label="Est. Annual Savings"
          value={formattedSavings}
          gradient="bg-gradient-to-br from-teal-500 to-emerald-700"
          sub="across all programs"
        />
        <MetricCard
          Icon={Icons.Link}
          label="Benefit Chains"
          value={cascadeCount || '—'}
          gradient="bg-gradient-to-br from-slate-600 to-slate-800"
          sub={cascadeCount > 0 ? 'auto-enrollment available' : 'none detected'}
        />
        <MetricCard
          Icon={Icons.Leaf}
          label="CO2 Avoided"
          value={co2Label}
          gradient="bg-gradient-to-br from-emerald-700 to-teal-900"
          sub={co2Tons > 0 ? 'per year (EPA estimate)' : 'no qualifying programs'}
        />
      </div>

      {/* Community impact */}
      <p className="text-xs text-slate-400 text-center mb-8 italic">
        In NYC, only 23% of eligible households enroll in HEAP — tools like this can change that.
      </p>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden divide-y divide-amber-100">
          <div className="flex items-center gap-2 px-5 py-3">
            <Icons.Warning className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Important notices</span>
          </div>
          {warnings.map((w, i) => (
            <div key={i} className="px-5 py-3 text-sm text-amber-800 leading-relaxed">{w}</div>
          ))}
        </div>
      )}

      {/* Program sections */}
      <ProgramSection tier="likely"   programs={likelyPrograms} />
      <ProgramSection tier="possible" programs={possiblePrograms} />
      <ProgramSection tier="unlikely" programs={unlikelyPrograms} />

      {/* Cascade chains — collapsed */}
      {cascadeCount > 0 && (
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setShowCascades((v) => !v)}
            className="w-full flex items-center justify-between gap-4 bg-white border border-slate-200 hover:border-emerald-400 rounded-xl px-5 py-4 transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                <Icons.Link className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Benefit Chain Analysis</p>
                <p className="text-xs text-slate-500">
                  {cascadeCount} chain{cascadeCount !== 1 ? 's' : ''} detected
                  {tc > 0 ? ` · +$${tc.toLocaleString()}/yr in auto-unlocked benefits` : ''}
                </p>
              </div>
            </div>
            <Icons.ChevronDown
              className={`w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-all ${showCascades ? 'rotate-180' : ''}`}
            />
          </button>

          {showCascades && (
            <div className="mt-3 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <CascadeSummary
                cascadeChains={assessment.cascadeChains}
                programCatalog={assessment.programCatalog}
                programs={programs}
                totalCascadeValue={tc}
                liveEnrichment={assessment.liveEnrichment}
                t={t}
              />
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed mb-8 border-t border-slate-100 pt-6">
        {t('results.disclaimer')}
      </p>

      {/* Bottom CTA */}
      <div className="text-center pb-8">
        <button
          type="button"
          onClick={onStartOver}
          className="px-6 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
        >
          Check a different household
        </button>
      </div>
    </div>
  );
}
