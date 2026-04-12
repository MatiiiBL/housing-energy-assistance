import { useState } from 'react';
import LanguageToggle from './LanguageToggle.jsx';

function SectionLabel({ children }) {
  return (
    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 first:mt-0">
      {children}
    </h2>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer py-1 group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? '' : 'bg-gray-200'
        }`}
        style={checked ? { backgroundColor: '#1D9E75' } : {}}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </div>
      <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
    </label>
  );
}

const BENEFITS = ['snap', 'medicaid', 'ssi', 'tanf', 'none'];

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

export default function IntakeForm({ onSubmit, language, onLanguageChange, error, t }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationErrors, setValidationErrors] = useState({});

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

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

  const validate = () => {
    const errs = {};
    const size = form.showCustomSize
      ? parseInt(form.householdSizeCustom, 10)
      : form.householdSize;
    if (!size || size < 1) errs.householdSize = 'Required';
    if (!form.annualIncome || isNaN(Number(form.annualIncome.replace(/,/g, ''))))
      errs.annualIncome = 'Required';
    if (!form.borough) errs.borough = 'Required';
    if (!form.housingType) errs.housingType = 'Required';
    if (!form.utilityProvider) errs.utilityProvider = 'Required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      // Scroll to first error
      document.querySelector('[data-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationErrors({});

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

  const fieldClass = (key) =>
    `block w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
      validationErrors[key]
        ? 'border-red-400 focus:ring-red-200 bg-red-50'
        : 'border-gray-300 focus:ring-brand-200 focus:border-brand-500 bg-white'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('intake.title')}</h1>
        <p className="text-sm text-gray-500">{t('intake.subtitle')}</p>
      </div>

      {/* Section A: Household Composition */}
      <SectionLabel>{t('intake.sectionA')}</SectionLabel>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('intake.householdSize')}
        </label>
        <div className="flex gap-2 flex-wrap" data-error={validationErrors.householdSize ? 'true' : undefined}>
          {[1, 2, 3, 4].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeButton(size)}
              className={`w-12 h-12 rounded-lg border-2 text-sm font-semibold transition-colors ${
                !form.showCustomSize && form.householdSize === size
                  ? 'text-white border-transparent'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
              style={
                !form.showCustomSize && form.householdSize === size
                  ? { backgroundColor: '#1D9E75', borderColor: '#1D9E75' }
                  : {}
              }
            >
              {size}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleSizeButton('5+')}
            className={`w-12 h-12 rounded-lg border-2 text-sm font-semibold transition-colors ${
              form.showCustomSize
                ? 'text-white border-transparent'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
            style={
              form.showCustomSize ? { backgroundColor: '#1D9E75', borderColor: '#1D9E75' } : {}
            }
          >
            {t('intake.householdSize.plus')}
          </button>
          {form.showCustomSize && (
            <input
              type="number"
              min="5"
              max="20"
              value={form.householdSizeCustom}
              onChange={(e) => set('householdSizeCustom', e.target.value)}
              placeholder={t('intake.householdSize.exact')}
              className="w-40 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-brand-500"
              style={{ '--tw-ring-color': '#1D9E75' }}
            />
          )}
        </div>
        {validationErrors.householdSize && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.householdSize}</p>
        )}
      </div>

      <div className="space-y-1 mb-1">
        <Toggle
          checked={form.hasChildUnder6}
          onChange={(v) => set('hasChildUnder6', v)}
          label={t('intake.childUnder6')}
        />
        <Toggle
          checked={form.hasSenior60Plus}
          onChange={(v) => set('hasSenior60Plus', v)}
          label={t('intake.senior60Plus')}
        />
        <Toggle
          checked={form.hasDisabledMember}
          onChange={(v) => set('hasDisabledMember', v)}
          label={t('intake.disabledMember')}
        />
      </div>

      {/* Section B: Income */}
      <SectionLabel>{t('intake.sectionB')}</SectionLabel>

      <div className="mb-5" data-error={validationErrors.annualIncome ? 'true' : undefined}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('intake.annualIncome')}
        </label>
        <p className="text-xs text-gray-400 mb-2">{t('intake.annualIncome.helper')}</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={form.annualIncome}
            onChange={(e) => set('annualIncome', e.target.value.replace(/[^0-9,]/g, ''))}
            placeholder={t('intake.annualIncome.placeholder')}
            className={`${fieldClass('annualIncome')} pl-7`}
          />
        </div>
        {validationErrors.annualIncome && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.annualIncome}</p>
        )}
      </div>

      {/* Section C: Location & Housing */}
      <SectionLabel>{t('intake.sectionC')}</SectionLabel>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div data-error={validationErrors.borough ? 'true' : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('intake.borough')}
          </label>
          <select
            value={form.borough}
            onChange={(e) => set('borough', e.target.value)}
            className={fieldClass('borough')}
          >
            <option value="">{t('intake.borough.placeholder')}</option>
            {['bronx', 'brooklyn', 'manhattan', 'queens', 'staten_island'].map((b) => (
              <option key={b} value={b}>
                {t(`intake.boroughs.${b}`)}
              </option>
            ))}
          </select>
          {validationErrors.borough && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.borough}</p>
          )}
        </div>

        <div data-error={validationErrors.housingType ? 'true' : undefined}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('intake.housingType')}
          </label>
          <select
            value={form.housingType}
            onChange={(e) => set('housingType', e.target.value)}
            className={fieldClass('housingType')}
          >
            <option value="">{t('intake.housingType.placeholder')}</option>
            {['renter_heat_included', 'renter_pay_utilities', 'homeowner', 'public_housing'].map(
              (h) => (
                <option key={h} value={h}>
                  {t(`intake.housing.${h}`)}
                </option>
              )
            )}
          </select>
          {validationErrors.housingType && (
            <p className="text-xs text-red-500 mt-1">{validationErrors.housingType}</p>
          )}
        </div>
      </div>

      {/* Section D: Utility */}
      <SectionLabel>{t('intake.sectionD')}</SectionLabel>

      <div className="mb-5" data-error={validationErrors.utilityProvider ? 'true' : undefined}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('intake.utilityProvider')}
        </label>
        <select
          value={form.utilityProvider}
          onChange={(e) => set('utilityProvider', e.target.value)}
          className={fieldClass('utilityProvider')}
        >
          <option value="">{t('intake.utilityProvider.placeholder')}</option>
          {['con_edison', 'national_grid', 'nyseg', 'other'].map((p) => (
            <option key={p} value={p}>
              {t(`intake.utility.${p}`)}
            </option>
          ))}
        </select>
        {validationErrors.utilityProvider && (
          <p className="text-xs text-red-500 mt-1">{validationErrors.utilityProvider}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('intake.monthlyBill')}{' '}
          <span className="font-bold" style={{ color: '#1D9E75' }}>
            ${form.monthlyEnergyBill}
            {t('intake.monthlyBill.perMonth')}
          </span>
        </label>
        <input
          type="range"
          min="50"
          max="500"
          step="5"
          value={form.monthlyEnergyBill}
          onChange={(e) => set('monthlyEnergyBill', Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{ accentColor: '#1D9E75' }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$50</span>
          <span>$500</span>
        </div>
      </div>

      {/* Section E: Existing Benefits */}
      <SectionLabel>{t('intake.sectionE')}</SectionLabel>

      <div className="mb-5">
        <p className="text-sm text-gray-600 mb-1">{t('intake.existingBenefits')}</p>
        <p className="text-xs text-gray-400 mb-3">{t('intake.existingBenefits.helper')}</p>
        <div className="flex flex-wrap gap-2">
          {BENEFITS.map((benefit) => {
            const selected = form.existingBenefits.includes(benefit);
            return (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleBenefit(benefit)}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                  selected
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
                style={selected ? { backgroundColor: '#1D9E75', borderColor: '#1D9E75' } : {}}
              >
                {t(`intake.benefits.${benefit}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section F: Language */}
      <SectionLabel>{t('intake.sectionF')}</SectionLabel>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('intake.language')}
        </label>
        <LanguageToggle language={language} onChange={onLanguageChange} t={t} />
      </div>

      {/* API error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base shadow-sm hover:opacity-90 active:opacity-80 transition-opacity"
        style={{ backgroundColor: '#1D9E75' }}
      >
        {t('intake.submit')}
      </button>
    </form>
  );
}
