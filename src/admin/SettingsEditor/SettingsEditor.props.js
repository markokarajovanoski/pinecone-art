// Form fields in display order, with their input type.
export const FIELDS = [
  { name: 'phone', type: 'tel' },
  { name: 'instagram_url', type: 'url' },
  { name: 'facebook_url', type: 'url' },
  { name: 'email', type: 'email' },
  { name: 'currency', type: 'text' },
  { name: 'shipping_fee', type: 'number' },
  { name: 'banner_text', type: 'text' },
];

/**
 * @typedef {object} SettingsEditorViewProps
 * @property {Record<string, string> | null} form  null while loading
 * @property {string | null} loadError
 * @property {boolean} saving
 * @property {{ type: 'ok' | 'error', text: string } | null} message
 * @property {(name: string, value: string) => void} onFieldChange
 * @property {(event: import('react').FormEvent) => void} onSave
 */
