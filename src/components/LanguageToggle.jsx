export default function LanguageToggle({ language, onChange, t }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
      {['en', 'es'].map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            language === lang
              ? 'text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={language === lang ? { backgroundColor: '#1D9E75' } : {}}
        >
          {t(`intake.lang.${lang}`)}
        </button>
      ))}
    </div>
  );
}
