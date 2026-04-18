import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment.js';
import IntakeForm from '../components/IntakeForm.jsx';
import ResultsView from '../components/ResultsView.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';
import LanguageToggle from '../components/LanguageToggle.jsx';
import en from '../i18n/en.json';
import es from '../i18n/es.json';

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

export default function AssessPage() {
  const [view, setView] = useState('intake');
  const [language, setLanguage] = useState('en');
  const [assessmentLanguage, setAssessmentLanguage] = useState('en');
  const { assess, error, assessment, reset } = useAssessment();

  const t = createT(language);

  const handleSubmit = async (profile) => {
    reset();
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/wattsgood-logo.webp"
              alt="WattsGood"
              className="h-10 w-10 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(476%) hue-rotate(107deg) brightness(92%) contrast(88%)' }}
            />
            <span className="text-slate-900 font-bold text-lg tracking-tight group-hover:text-emerald-600 transition-colors">
              WattsGood
            </span>
          </Link>
          <LanguageToggle language={language} onChange={setLanguage} t={t} compact />
        </div>
      </header>

      <main className={`mx-auto px-4 py-10 ${view === 'results' ? 'max-w-6xl' : 'max-w-3xl'}`}>
        {view === 'intake' && (
          <IntakeForm
            onSubmit={handleSubmit}
            assessmentLanguage={assessmentLanguage}
            onAssessmentLanguageChange={setAssessmentLanguage}
            error={error}
            t={t}
          />
        )}
        {view === 'loading' && <LoadingSkeleton />}
        {view === 'results' && assessment && (
          <ResultsView assessment={assessment} onStartOver={handleStartOver} t={t} />
        )}
      </main>
    </div>
  );
}
