export default function CascadeConnector({ t }) {
  return (
    <div className="flex items-center justify-center my-1 py-1">
      <div
        className="flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm font-medium"
        style={{
          backgroundColor: '#f0fdf8',
          borderColor: '#86efbf',
          color: '#126e52',
        }}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span>{t('results.cascade_connector')}</span>
      </div>
    </div>
  );
}
