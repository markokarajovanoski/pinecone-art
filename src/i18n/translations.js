// The UI text lives in one file per language: src/locales/<language>/translation.json.
// Keys are grouped by section and looked up with dots ("nav.home" → { "nav": { "home": … } }).
// {name} placeholders are filled in by t(key, { name }).
import en from '../locales/en/translation.json';
import mk from '../locales/mk/translation.json';

const translations = { en, mk };

export const LANGUAGES = Object.keys(translations);
export const DEFAULT_LANGUAGE = 'mk';

const find = (dictionary, key) => key.split('.').reduce((node, part) => node?.[part], dictionary);

// Text for a key in the given language, falling back to the default language.
export function lookup(lang, key) {
  const text = find(translations[lang], key) ?? find(translations[DEFAULT_LANGUAGE], key);
  return typeof text === 'string' ? text : undefined;
}
