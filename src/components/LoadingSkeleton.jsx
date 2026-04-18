import { useState, useEffect } from 'react';

const MESSAGES = [
  'Checking heat & cooling assistance programs...',
  'Verifying current HEAP application window...',
  'Evaluating Con Edison & National Grid discounts...',
  'Tracing your enrollment cascade chains...',
  'Checking NYSERDA weatherization eligibility...',
  'Calculating estimated annual savings...',
  'Finalizing your personalized results...',
];

export default function LoadingSkeleton() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
        setVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  const progress = (msgIndex + 1) / MESSAGES.length;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Spinner */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
        Analyzing your eligibility
      </h2>
      <p className="text-slate-500 text-sm mb-8 text-center">
        Checking programs across NYC agencies — this takes about 15 seconds.
      </p>

      {/* Cycling message */}
      <div className="h-6 flex items-center justify-center mb-8">
        <p
          className="text-sm font-medium text-emerald-700 text-center transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-6">
        {MESSAGES.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-500 ${
              i < msgIndex
                ? 'w-2.5 h-2.5 bg-emerald-600'
                : i === msgIndex
                ? 'w-3 h-3 bg-emerald-500 ring-2 ring-emerald-200'
                : 'w-2 h-2 bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
