export const LANGUAGES = [
  { code: 'en',      label: 'English' },
  { code: 'es',      label: 'Español' },
];

export default function LanguageToggle({ language, onChange }) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>{label}</option>
      ))}
    </select>
  );
}
