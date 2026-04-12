export default function ResultsView({ assessment, onStartOver }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-4">Your Results</h1>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{assessment.output}</p>
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onStartOver}
          className="px-6 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
