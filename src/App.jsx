import { useState } from 'react';
import { useAssessment } from './hooks/useAssessment.js';
import IntakeForm from './components/IntakeForm.jsx';
import ResultsView from './components/ResultsView.jsx';
import LoadingSkeleton from './components/LoadingSkeleton.jsx';
import en from './i18n/en.json';
import es from './i18n/es.json';

const translations = { en, es };

function createT() {
  return (key, vars = {}) => {
    const text = translations['en']?.[key] ?? key;
    return Object.entries(vars).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      text
    );
  };
}

export default function App() {
  const [view, setView] = useState('intake'); // 'intake' | 'loading' | 'results'
  const [language, setLanguage] = useState('en');
  const { assess, loading, error, assessment, reset } = useAssessment();

  const t = createT();

  const handleSubmit = async (profile) => {
    setView('loading');
    try {
      await assess({ ...profile, language });
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: '#1D9E75' }}
          >
            E
          </div>
          <span className="font-semibold text-gray-900">Energy Assistance Navigator</span>
          <span className="text-gray-400 text-sm ml-1">NYC</span>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {view === 'intake' && (
          <IntakeForm
            onSubmit={handleSubmit}
            language={language}
            onLanguageChange={setLanguage}
            error={error}
            t={t}
          />
        )}
        {view === 'loading' && <LoadingSkeleton language={language} t={t} />}
        {view === 'results' && assessment && (
          <ResultsView
            assessment={assessment}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}
