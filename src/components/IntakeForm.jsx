import { useState } from 'react';
import ASSESSMENT_LANGUAGE_CODES from '../../server/assessmentLanguages.json';

const STEPS = [
  { id: 'household', label: 'Household' },
  { id: 'income', label: 'Income' },
  { id: 'home', label: 'Home' },
  { id: 'energy', label: 'Energy' },
  { id: 'benefits', label: 'Benefits' },
];

const BOROUGHS = ['bronx', 'brooklyn', 'manhattan', 'queens', 'staten_island'];
const HOUSING_TYPES = ['renter_heat_included', 'renter_pay_utilities', 'homeowner', 'public_housing'];
const UTILITY_PROVIDERS = ['con_edison', 'national_grid', 'nyseg', 'other'];
const BENEFITS = ['snap', 'medicaid', 'ssi', 'tanf', 'heap_regular', 'liheap', 'wic', 'public_assistance', 'section8', 'none'];

const DEMO_PROFILES = [
  {
    label: 'The Bronx Family',
    description: 'Family of 4 · $38k · SNAP',
    icon: '🏠',
    form: {
      householdSize: 4, showCustomSize: false, householdSizeCustom: '',
      annualIncome: '38000', borough: 'bronx', housingType: 'renter_pay_utilities',
      utilityProvider: 'con_edison', monthlyEnergyBill: 185,
      existingBenefits: ['snap'], hasChildUnder6: true, hasSenior60Plus: false, hasDisabledMember: false,
    },
  },
  {
    label: 'Senior on Fixed Income',
    description: '1 person · $16k · Medicaid + SSI',
    icon: '👴',
    form: {
      householdSize: 1, showCustomSize: false, householdSizeCustom: '',
      annualIncome: '16000', borough: 'brooklyn', housingType: 'renter_pay_utilities',
      utilityProvider: 'con_edison', monthlyEnergyBill: 95,
      existingBenefits: ['medicaid', 'ssi'], hasChildUnder6: false, hasSenior60Plus: true, hasDisabledMember: false,
    },
  },
  {
    label: 'Working Renter',
    description: '2 people · $52k · No benefits',
    icon: '🔑',
    form: {
      householdSize: 2, showCustomSize: false, householdSizeCustom: '',
      annualIncome: '52000', borough: 'queens', housingType: 'renter_pay_utilities',
      utilityProvider: 'con_edison', monthlyEnergyBill: 130,
      existingBenefits: [], hasChildUnder6: false, hasSenior60Plus: false, hasDisabledMember: false,
    },
  },
];

const INITIAL_FORM = {
  householdSize: 1,
  householdSizeCustom: '',
  showCustomSize: false,
  annualIncome: '',
  borough: '',
  housingType: '',
  utilityProvider: '',
  monthlyEnergyBill: 150,
  existingBenefits: [],
  hasChildUnder6: false,
  hasSenior60Plus: false,
  hasDisabledMember: false,
};

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'bg-emerald-600 text-white'
                    : active
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs mt-1 font-medium hidden sm:block ${active ? 'text-emerald-600' : done ? 'text-slate-400' : 'text-slate-300'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 sm:w-16 h-0.5 mb-4 mx-1 transition-colors duration-300 ${done ? 'bg-emerald-600' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CardOption({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative p-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer w-full ${
        selected
          ? 'border-emerald-500 bg-emerald-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30'
      } ${className}`}
    >
      {selected && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label, sublabel }) {
  return (
    <label
      className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 transition-all ${
        checked ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 w-10 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-emerald-600' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
      <div>
        <div className={`text-sm font-medium ${checked ? 'text-emerald-800' : 'text-slate-700'}`}>{label}</div>
        {sublabel && <div className="text-xs text-slate-500 mt-0.5">{sublabel}</div>}
      </div>
    </label>
  );
}

export default function IntakeForm({ onSubmit, assessmentLanguage, onAssessmentLanguageChange, error, t }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const loadPreset = (preset) => {
    setForm(preset.form);
    setValidationError('');
    setShowPresets(false);
    setStep(0);
  };

  const toggleBenefit = (benefit) => {
    setForm((f) => {
      if (benefit === 'none') {
        return { ...f, existingBenefits: f.existingBenefits.includes('none') ? [] : ['none'] };
      }
      const without = f.existingBenefits.filter((b) => b !== 'none' && b !== benefit);
      const has = f.existingBenefits.includes(benefit);
      return { ...f, existingBenefits: has ? without : [...without, benefit] };
    });
  };

  const handleSizeButton = (size) => {
    if (size === '5+') {
      set('showCustomSize', true);
      set('householdSize', 5);
    } else {
      set('showCustomSize', false);
      set('householdSize', size);
      set('householdSizeCustom', '');
    }
  };

  const validateStep = () => {
    switch (step) {
      case 0: {
        const size = form.showCustomSize ? parseInt(form.householdSizeCustom, 10) : form.householdSize;
        if (!size || size < 1) return 'Please select your household size.';
        return '';
      }
      case 1:
        if (!form.annualIncome || isNaN(Number(form.annualIncome.replace(/,/g, ''))))
          return 'Please enter your annual household income.';
        return '';
      case 2:
        if (!form.borough) return 'Please select your borough.';
        if (!form.housingType) return 'Please select your housing type.';
        return '';
      case 3:
        if (!form.utilityProvider) return 'Please select your utility provider.';
        return '';
      default:
        return '';
    }
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setValidationError(err); return; }
    setValidationError('');
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setValidationError('');
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawIncome = Number(form.annualIncome.replace(/,/g, ''));
    const householdSize = form.showCustomSize
      ? Math.max(1, parseInt(form.householdSizeCustom, 10) || 1)
      : form.householdSize;
    onSubmit({
      householdSize,
      annualIncome: rawIncome,
      borough: form.borough,
      housingType: form.housingType,
      utilityProvider: form.utilityProvider,
      monthlyEnergyBill: form.monthlyEnergyBill,
      existingBenefits: form.existingBenefits.length === 0 ? ['none'] : form.existingBenefits,
      householdMembers: {
        hasChildUnder6: form.hasChildUnder6,
        hasSenior60Plus: form.hasSenior60Plus,
        hasDisabledMember: form.hasDisabledMember,
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-1.5 mb-4">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">Free Eligibility Check</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t('intake.title')}</h1>
        <p className="text-slate-500 text-sm">{t('intake.subtitle')}</p>
      </div>

      {/* Demo presets */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowPresets((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform ${showPresets ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Try a demo profile
        </button>
        {showPresets && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {DEMO_PROFILES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => loadPreset(preset)}
                className="flex flex-col items-start gap-1 p-3 rounded-xl border-2 border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50 transition-all text-left"
              >
                <span className="text-xl">{preset.icon}</span>
                <span className="text-sm font-semibold text-slate-800">{preset.label}</span>
                <span className="text-xs text-slate-500">{preset.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <StepIndicator current={step} />

        <form onSubmit={handleSubmit} noValidate>
          {/* Step 0: Household */}
          {step === 0 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Who's in your household?</h2>
              <p className="text-sm text-slate-500 mb-6">Count everyone who lives with you, including yourself.</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Household size</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeButton(size)}
                      className={`w-14 h-14 rounded-xl border-2 text-base font-bold transition-all ${
                        !form.showCustomSize && form.householdSize === size
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleSizeButton('5+')}
                    className={`w-14 h-14 rounded-xl border-2 text-base font-bold transition-all ${
                      form.showCustomSize
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    5+
                  </button>
                  {form.showCustomSize && (
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={form.householdSizeCustom}
                      onChange={(e) => set('householdSizeCustom', e.target.value)}
                      placeholder="Exact #"
                      className="w-24 rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Does your household include any of the following?</label>
                <div className="space-y-2">
                  <Toggle
                    checked={form.hasChildUnder6}
                    onChange={(v) => set('hasChildUnder6', v)}
                    label={t('intake.childUnder6')}
                    sublabel="Children under 6 may unlock additional benefits"
                  />
                  <Toggle
                    checked={form.hasSenior60Plus}
                    onChange={(v) => set('hasSenior60Plus', v)}
                    label={t('intake.senior60Plus')}
                    sublabel="Seniors 60+ qualify for priority HEAP access"
                  />
                  <Toggle
                    checked={form.hasDisabledMember}
                    onChange={(v) => set('hasDisabledMember', v)}
                    label={t('intake.disabledMember')}
                    sublabel="Disability status may expand your eligibility"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Income */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Annual household income</h2>
              <p className="text-sm text-slate-500 mb-6">Include all sources before taxes — wages, Social Security, benefits, etc.</p>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.annualIncome}
                  onChange={(e) => set('annualIncome', e.target.value.replace(/[^0-9,]/g, ''))}
                  placeholder="e.g. 38,000"
                  className="block w-full rounded-xl border-2 border-slate-200 pl-9 pr-4 py-4 text-lg font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <p className="text-xs text-slate-400">Most NYC energy programs serve households earning up to 80% of Area Median Income (~$77k for a family of 4).</p>

              {/* Income bracket hints */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { label: 'Under $20k', sub: 'All programs likely open', color: 'emerald' },
                  { label: '$20k–$50k', sub: 'Most programs apply', color: 'emerald' },
                  { label: '$50k–$80k', sub: 'Some programs apply', color: 'amber' },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-colors ${
                      tier.color === 'emerald'
                        ? 'border-emerald-100 bg-emerald-50/60'
                        : 'border-amber-100 bg-amber-50/60'
                    }`}
                    onClick={() => {
                      const values = { 'Under $20k': '18000', '$20k–$50k': '35000', '$50k–$80k': '60000' };
                      set('annualIncome', values[tier.label]);
                    }}
                  >
                    <div className={`text-xs font-bold ${tier.color === 'emerald' ? 'text-emerald-700' : 'text-amber-700'}`}>{tier.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{tier.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Home */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Where do you live?</h2>
              <p className="text-sm text-slate-500 mb-6">Some programs are borough-specific or have local application offices.</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Borough</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BOROUGHS.map((b) => (
                    <CardOption key={b} selected={form.borough === b} onClick={() => set('borough', b)}>
                      <span className="text-sm font-semibold text-slate-800">{t(`intake.boroughs.${b}`)}</span>
                    </CardOption>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Housing type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'renter_heat_included', icon: '🏢', sub: 'Heat included in rent' },
                    { key: 'renter_pay_utilities', icon: '🔌', sub: 'I pay my own utilities' },
                    { key: 'homeowner', icon: '🏡', sub: 'I own my home' },
                    { key: 'public_housing', icon: '🏛️', sub: 'NYCHA / public housing' },
                  ].map(({ key, icon, sub }) => (
                    <CardOption key={key} selected={form.housingType === key} onClick={() => set('housingType', key)}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{t(`intake.housing.${key}`)}</div>
                          <div className="text-xs text-slate-500">{sub}</div>
                        </div>
                      </div>
                    </CardOption>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Energy */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Your energy setup</h2>
              <p className="text-sm text-slate-500 mb-6">This helps us find utility-specific discounts and rebates.</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Utility provider</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'con_edison', icon: '⚡', sub: 'Serves most of NYC' },
                    { key: 'national_grid', icon: '🔥', sub: 'Gas service provider' },
                    { key: 'nyseg', icon: '🌐', sub: 'Upstate & some boroughs' },
                    { key: 'other', icon: '❓', sub: 'Other or unknown' },
                  ].map(({ key, icon, sub }) => (
                    <CardOption key={key} selected={form.utilityProvider === key} onClick={() => set('utilityProvider', key)}>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{t(`intake.utility.${key}`)}</div>
                          <div className="text-xs text-slate-500">{sub}</div>
                        </div>
                      </div>
                    </CardOption>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Estimated monthly energy bill:{' '}
                  <span className="text-emerald-600">${form.monthlyEnergyBill}/mo</span>
                </label>
                <p className="text-xs text-slate-400 mb-3">Your best estimate — doesn't need to be exact.</p>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="5"
                  value={form.monthlyEnergyBill}
                  onChange={(e) => set('monthlyEnergyBill', Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>$50</span>
                  <span className="text-slate-500 italic">NYC avg: ~$150/mo</span>
                  <span>$500</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Benefits & Language */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Current benefits & preferences</h2>
              <p className="text-sm text-slate-500 mb-5">Existing benefits can automatically qualify you for additional programs — no extra applications needed.</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Programs you're currently enrolled in</label>
                <div className="flex flex-wrap gap-2">
                  {BENEFITS.map((benefit) => {
                    const selected = form.existingBenefits.includes(benefit);
                    return (
                      <button
                        key={benefit}
                        type="button"
                        onClick={() => toggleBenefit(benefit)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                          selected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                      >
                        {t(`intake.benefits.${benefit}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="assessment-language">
                  Preferred language for results
                </label>
                <p className="text-xs text-slate-400 mb-2">Program details from the AI assistant will use this language.</p>
                <select
                  id="assessment-language"
                  value={assessmentLanguage}
                  onChange={(e) => onAssessmentLanguageChange(e.target.value)}
                  className="block w-full rounded-xl border-2 border-slate-200 px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {ASSESSMENT_LANGUAGE_CODES.map((code) => (
                    <option key={code} value={code}>
                      {t(`intake.lang.${code}`)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Validation error */}
          {validationError && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {validationError}
            </div>
          )}

          {/* API error */}
          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className={`flex mt-8 gap-3 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 sm:flex-none sm:px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all"
              >
                {t('intake.submit')} →
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400 mt-4">
        Your information is used only to check eligibility. We don't store or share your data.
      </p>
    </div>
  );
}
