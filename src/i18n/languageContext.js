import { createContext, useContext } from 'react';

export const LanguageContext = createContext(null);

// { lang: 'en' | 'mk', setLang, t(key, vars) }
export function useLanguage() {
  return useContext(LanguageContext);
}
