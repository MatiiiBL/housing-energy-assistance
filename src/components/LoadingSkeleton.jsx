import { useState, useEffect } from 'react';

const TASKS = [
  'Loading your household profile',
  'Connecting to NYC program database',
  'Checking HEAP Regular Benefit eligibility',
  'Evaluating income against 2025 state median limits',
  'Tracing SNAP → HEAP categorical cascade',
  'Checking Con Edison Energy Affordability Program',
  'Verifying NYSERDA EmPower+ qualification',
  'Checking weatherization assistance availability',
  'Looking up current application windows & deadlines',
  'Evaluating HEAP Cooling Assistance eligibility',
  'Calculating benefit chain cascade values',
  'Estimating your annual savings',
  'Generating personalized action plan',
  'Finalizing your results',
];

const FACTS = [
  {
    stat: '23%',
    text: "Only 23% of eligible NYC households are enrolled in HEAP — most miss out simply because they don't know they qualify.",
  },
  {
    stat: '$11k+',
    text: 'EmPower+ can cover up to $11,000 in free home upgrades — appliances, insulation, and heat pump installation — at no cost to you.',
  },
  {
    stat: '1 form',
    text: 'SNAP enrollment automatically qualifies your household for HEAP. No extra income check or paperwork required.',
  },
  {
    stat: '4 more',
    text: "A single HEAP application can unlock up to 4 additional programs automatically through NYC's cascade benefit system.",
  },
  {
    stat: '$840',
    text: "Con Edison's Energy Affordability Program can cut your annual electric bill by up to $840 — and enrollment can happen automatically.",
  },
  {
    stat: 'Free A/C',
    text: 'HEAP Cooling Assistance opens every June and provides free air conditioners to eligible households with seniors or children under 6.',
  },
  {
    stat: '$400',
    text: 'The HRA Home Energy Supplemental Assistance payment is triggered automatically when you apply for HEAP — no separate form needed.',
  },
];

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin flex-shrink-0" />
  );
}

export default function LoadingSkeleton() {
  const [taskIndex, setTaskIndex] = useState(0);
  const [taskList, setTaskList] = useState([{ text: TASKS[0], done: false }]);
  const [factIndex, setFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  // Advance through tasks
  useEffect(() => {
    if (taskIndex >= TASKS.length - 1) return;
    const timer = setTimeout(() => {
      setTaskList((prev) => {
        const updated = prev.map((t, i) =>
          i === prev.length - 1 ? { ...t, done: true } : t
        );
        return [...updated, { text: TASKS[taskIndex + 1], done: false }];
      });
      setTaskIndex((i) => i + 1);
    }, 4800);
    return () => clearTimeout(timer);
  }, [taskIndex]);

  // Rotate facts with fade
  useEffect(() => {
    const timer = setInterval(() => {
      setFactVisible(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % FACTS.length);
        setFactVisible(true);
      }, 400);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const progress = Math.min(Math.round((taskIndex / (TASKS.length - 1)) * 100), 97);
  const displayTasks = taskList.slice(-4);
  const fact = FACTS[factIndex];

  return (
    <div className="min-h-[78vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* ── Animated icon ── */}
        <div className="relative flex items-center justify-center w-28 h-28 mb-7 mx-auto">
          {/* Outer sonar ring */}
          <div
            className="absolute w-28 h-28 rounded-full border-2 border-emerald-200 animate-ping"
            style={{ animationDuration: '3s' }}
          />
          {/* Middle sonar ring */}
          <div
            className="absolute w-20 h-20 rounded-full border-2 border-emerald-300 animate-ping"
            style={{ animationDuration: '2.3s', animationDelay: '0.7s' }}
          />
          {/* Track circle */}
          <div className="absolute w-14 h-14 rounded-full border-4 border-emerald-100" />
          {/* Spinner */}
          <div className="absolute w-14 h-14 rounded-full border-4 border-transparent border-t-emerald-600 animate-spin" />
          {/* Bolt icon */}
          <div className="absolute flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* ── Title ── */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Analyzing your eligibility</h2>
          <p className="text-sm text-slate-500">
            Checking every NYC energy program — usually takes 30–90 seconds
          </p>
        </div>

        {/* ── Live activity log ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Live activity
            </span>
            <span className="ml-auto text-xs text-slate-400 font-mono">
              {taskIndex + 1}/{TASKS.length}
            </span>
          </div>

          {/* Task rows */}
          <div className="divide-y divide-slate-50 px-1">
            {displayTasks.map((task) => (
              <div
                key={task.text}
                className={`flex items-center gap-3 px-3 py-3 transition-opacity duration-500 ${
                  task.done ? 'opacity-40' : 'opacity-100 task-enter'
                }`}
              >
                <div className="flex-shrink-0">
                  {task.done ? <CheckIcon /> : <SpinnerIcon />}
                </div>
                <span
                  className={`text-sm leading-snug ${
                    task.done ? 'text-slate-400' : 'text-slate-800 font-medium'
                  }`}
                >
                  {task.text}
                  {!task.done && (
                    <span className="animate-pulse">...</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Did you know fact card ── */}
        <div
          className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 mb-6 transition-opacity duration-300"
          style={{ opacity: factVisible ? 1 : 0 }}
        >
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2">
            Did you know?
          </p>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-2xl font-black text-emerald-600 leading-none min-w-[3.5rem]">
              {fact.stat}
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">{fact.text}</p>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-slate-400 font-medium">Progress</span>
            <span className="text-xs font-bold text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 text-center mt-3">
            We check all 17 NYC programs so you don't have to
          </p>
        </div>
      </div>
    </div>
  );
}
