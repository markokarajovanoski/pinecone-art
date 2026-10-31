import { useEffect, useMemo, useState } from 'react';
import { LanguageContext } from './languageContext';
import { LANGUAGES, translations } from './translations';

const STORAGE_KEY = 'pinecone-art-lang';

// The visitor's last choice, otherwise Macedonian for browsers set to Macedonian.
function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (LANGUAGES.includes(saved)) return saved;
  } catch {
    // storage can be blocked (private mode); fall through
  }
  return navigator.language?.toLowerCase().startsWith('mk') ? 'mk' : 'en';
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = translations[lang]['meta.title'];
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // not saved; the choice still applies for this visit
    }
  }, [lang]);

  const value = useMemo(() => {
    const t = (key, vars = {}) => {
      const text = translations[lang][key] ?? translations.en[key] ?? key;
      return text.replace(/\{(\w+)\}/g, (match, name) => vars[name] ?? match);
    };
    return { lang, setLang, t };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
