import { useState, useEffect } from 'react';

const MSG_KEYS = [
  'loading.msg0',
  'loading.msg1',
  'loading.msg2',
  'loading.msg3',
  'loading.msg4',
  'loading.msg5',
  'loading.msg6',
];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="shimmer h-5 w-48 rounded mb-2" />
          <div className="shimmer h-3.5 w-32 rounded" />
        </div>
        <div className="shimmer h-6 w-24 rounded-full" />
      </div>
      <div className="shimmer h-4 w-full rounded mb-2" />
      <div className="shimmer h-4 w-3/4 rounded mb-4" />
      <div className="flex gap-3">
        <div className="shimmer h-8 w-28 rounded" />
        <div className="shimmer h-8 w-28 rounded" />
      </div>
    </div>
  );
}

export default function LoadingSkeleton({ t }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MSG_KEYS.length - 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Progress indicator */}
      <div
        className="rounded-xl p-4 mb-6 flex items-center gap-3"
        style={{ backgroundColor: '#f0fdf8', borderColor: '#bbf7de', border: '1px solid' }}
      >
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
          style={{ borderColor: '#1D9E75', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-medium" style={{ color: '#126e52' }}>
          {t(MSG_KEYS[msgIndex])}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{
            backgroundColor: '#1D9E75',
            width: `${((msgIndex + 1) / MSG_KEYS.length) * 100}%`,
          }}
        />
      </div>

      {/* Summary bar skeleton */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="shimmer h-7 w-12 rounded mx-auto mb-2" />
            <div className="shimmer h-3 w-20 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Program card skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
