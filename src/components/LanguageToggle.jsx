export default function LanguageToggle({ language, onChange, t, compact = false }) {
  const pad = compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <div
      className="inline-flex rounded-full border border-gray-300 overflow-hidden shadow-sm flex-shrink-0"
      role="group"
      aria-label={t('intake.uiLanguage')}
    >
      {['en', 'es'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`${pad} font-medium transition-colors ${
            language === lang ? 'text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={language === lang ? { backgroundColor: '#1D9E75' } : {}}
        >
          {t(`intake.lang.${lang}`)}
        </button>
      ))}
    </div>
  );
}
