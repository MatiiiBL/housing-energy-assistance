const LANGUAGE_NAMES = {
  'en':      'English',
  'es':      'Spanish (Español)',
  'zh-hans': 'Simplified Chinese (简体中文)',
  'zh-hant': 'Traditional Chinese (繁體中文)',
  'bn':      'Bengali (বাংলা)',
  'ru':      'Russian (Русский)',
  'ht':      'Haitian Creole (Kreyòl ayisyen)',
  'ko':      'Korean (한국어)',
  'ar':      'Arabic (العربية)',
  'fr':      'French (Français)',
  'pl':      'Polish (Polski)',
  'ur':      'Urdu (اردو)',
  'tl':      'Filipino (Tagalog)',
  'it':      'Italian (Italiano)',
  'yi':      'Yiddish (ייִדיש)',
  'el':      'Greek (Ελληνικά)',
  'hi':      'Hindi (हिन्दी)',
  'pt':      'Portuguese (Português)',
  'he':      'Hebrew (עברית)',
  'vi':      'Vietnamese (Tiếng Việt)',
  'ja':      'Japanese (日本語)',
  'sq':      'Albanian (Shqip)',
  'am':      'Amharic (አማርኛ)',
  'pa':      'Punjabi (ਪੰਜਾਬੀ)',
  'tr':      'Turkish (Türkçe)',
  'sw':      'Swahili (Kiswahili)',
};

function buildSystemPrompt(language) {
  const lang = LANGUAGE_NAMES[language] ?? 'English';
  return `You are an energy assistance advisor for New York City households. Given a household profile, identify all energy assistance programs they may be eligible for.

Return ONLY a valid JSON array. No explanation, no markdown, no code fences. Start with [ and end with ].

Each element must have exactly these fields:
{
  "name": string,
  "eligibility": "likely" | "possible" | "unlikely",
  "reason": string (1-2 sentences explaining why this household qualifies or doesn't),
  "estimatedValue": string (e.g. "$200–$500/year" or "Up to $600 one-time"),
  "applicationUrl": string | null,
  "requiredDocuments": string[],
  "notes": string | null
}

Programs to evaluate:
- HEAP Regular Benefit (HRA — heating assistance, income-based)
- HEAP Emergency Benefit (HRA — requires active shutoff notice)
- Energy Affordability Program / EAP (Con Edison or National Grid — monthly discount)
- EmPower+ Weatherization (NYSERDA — free home energy upgrades)
- Weatherization Assistance Program / WAP (NYS HCR — insulation and efficiency work)
- EnergyShare (Con Edison / HeartShare — one-time grant, Con Ed customers only)
- Community Solar Low-Income Track (bill credits, no panels needed)
- Lifeline Telecom Discount (FCC — phone/internet discount if on SNAP/Medicaid/HEAP)

Respond in ${lang}.`;
}

module.exports = { buildSystemPrompt };
