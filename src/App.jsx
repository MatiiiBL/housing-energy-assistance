import { useState } from 'react';
import { useAssessment } from './hooks/useAssessment.js';
import IntakeForm from './components/IntakeForm.jsx';
import ResultsView from './components/ResultsView.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import en from './i18n/en.json';
import es from './i18n/es.json';

const translations = { en, es };

function createT(language) {
  return (key, vars = {}) => {
    const text = translations[language]?.[key] ?? key;
    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      text
    );
  };
}

export default function App() {
  const [view, setView] = useState('intake'); // 'intake' | 'loading' | 'results'
  const [language, setLanguage] = useState('en');
  const [assessmentLanguage, setAssessmentLanguage] = useState('en');
  const { assess, loading, error, assessment, reset } = useAssessment();

  const t = createT(language);

  const handleSubmit = async (profile) => {
    setView('loading');
    try {
      await assess({ ...profile, language: assessmentLanguage });
      setView('results');
    } catch {
      setView('intake');
    }
  };

  const handleStartOver = () => {
    reset();
    setView('intake');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
              <img
                src="/wattsgood-logo.webp"
                alt={t('brand.name')}
                width={400}
                height={400}
                className="w-[min(92vw,22rem)] h-[min(92vw,22rem)] sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain flex-shrink-0"
                decoding="async"
              />
              <div className="text-center sm:text-left min-w-0">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {t('brand.name')}
                </p>
                <p className="mt-1 text-base sm:text-lg text-gray-600 max-w-md">
                  {t('brand.slogan')}
                </p>
              </div>
            </div>
            <div className="flex justify-center sm:justify-end sm:self-start">
              <LanguageToggle language={language} onChange={setLanguage} t={t} compact />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'intake' && (
          <IntakeForm
            onSubmit={handleSubmit}
            assessmentLanguage={assessmentLanguage}
            onAssessmentLanguageChange={setAssessmentLanguage}
            error={error}
            t={t}
          />
        )}
        {view === 'loading' && <LoadingSkeleton language={language} t={t} />}
        {view === 'results' && assessment && (
          <ResultsView assessment={assessment} onStartOver={handleStartOver} t={t} />
        )}
      </main>
    </div>
  );
}
