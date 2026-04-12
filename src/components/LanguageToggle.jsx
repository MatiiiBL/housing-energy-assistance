export const LANGUAGES = [
  { code: 'en',      label: 'English' },
  { code: 'es',      label: 'Español' },
  { code: 'zh-hans', label: '中文（简体）' },
  { code: 'zh-hant', label: '中文（繁體）' },
  { code: 'bn',      label: 'বাংলা' },
  { code: 'ru',      label: 'Русский' },
  { code: 'ht',      label: 'Kreyòl ayisyen' },
  { code: 'ko',      label: '한국어' },
  { code: 'ar',      label: 'العربية' },
  { code: 'fr',      label: 'Français' },
  { code: 'pl',      label: 'Polski' },
  { code: 'ur',      label: 'اردو' },
  { code: 'tl',      label: 'Filipino' },
  { code: 'it',      label: 'Italiano' },
  { code: 'yi',      label: 'ייִדיש' },
  { code: 'el',      label: 'Ελληνικά' },
  { code: 'hi',      label: 'हिन्दी' },
  { code: 'pt',      label: 'Português' },
  { code: 'he',      label: 'עברית' },
  { code: 'vi',      label: 'Tiếng Việt' },
  { code: 'ja',      label: '日本語' },
  { code: 'sq',      label: 'Shqip' },
  { code: 'am',      label: 'አማርኛ' },
  { code: 'pa',      label: 'ਪੰਜਾਬੀ' },
  { code: 'tr',      label: 'Türkçe' },
  { code: 'sw',      label: 'Kiswahili' },
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
