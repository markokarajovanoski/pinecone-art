// Languages offered, in display order. Each label is written in its own language.
export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'mk', label: 'Македонски' },
];

/**
 * @typedef {object} LanguageSwitchViewProps
 * @property {{ code: string, label: string }[]} options
 * @property {string} activeLang
 * @property {string} groupLabel  accessible name for the group of flags
 * @property {(code: string) => void} onSelect
 */
