// The choices offered in each step. Labels come from translations (custom.type.<id>, …).
// Photos are real pieces, so visitors see what each choice looks like.

export const TYPES = [
  { id: 'framed', photo: '/images/3f3e9e01-5da5-4831-82cb-fb66bc2fde16.jpg' },
  { id: 'wreath', photo: '/images/35b5e998-89de-49dc-b5fa-99f6db6087a2.jpg' },
  { id: 'standing', photo: '/images/55c63e88-56b0-4707-9818-39cee1322435.jpg' },
  { id: 'heart', photo: '/images/c5834be9-52f5-488d-a119-52988bcf3511.jpg' },
];

// Colour themes, shown as a small cluster of soft colour circles (no photos), plus
// "pick your own". Shades are slightly muted so the screen stays calm.
export const PALETTES = [
  { id: 'pink', colors: ['#eeb3c3', '#d98aa3', '#f8ecef', '#c9a3ad'] },
  { id: 'autumn', colors: ['#ee8a57', '#f3c95f', '#fbf1e4', '#b56a45'] },
  { id: 'blue', colors: ['#7aa5d6', '#a08bc6', '#eef1f8', '#55596b'] },
  { id: 'jewel', colors: ['#56a19e', '#d8bb83', '#a0525e', '#8d7fab'] },
  { id: 'silver', colors: ['#cdd1d8', '#66a6a5', '#a492c8', '#f4f5f7'] },
  { id: 'natural', colors: ['#d6bc8e', '#a88a63', '#f3e9d6', '#83966a'] },
  { id: 'christmas', colors: ['#cf5b60', '#5a9068', '#d8bb83', '#fbf6ef'] },
  { id: 'custom', colors: [] },
];

// Single colours for "pick your own" (up to MAX_COLORS). Names come from custom.color.<id>.
export const COLORS = [
  { id: 'pink', hex: '#eeb3c3' },
  { id: 'red', hex: '#cf5b60' },
  { id: 'burgundy', hex: '#8f4652' },
  { id: 'orange', hex: '#ee8a57' },
  { id: 'yellow', hex: '#f3c95f' },
  { id: 'gold', hex: '#d8bb83' },
  { id: 'white', hex: '#fbf8f3' },
  { id: 'silver', hex: '#cdd1d8' },
  { id: 'teal', hex: '#56a19e' },
  { id: 'blue', hex: '#7aa5d6' },
  { id: 'purple', hex: '#a08bc6' },
  { id: 'green', hex: '#83a674' },
  { id: 'brown', hex: '#a88a63' },
  { id: 'black', hex: '#55596b' },
];
export const MAX_COLORS = 3;

// Placeholder sizes and starting prices (denars) — the family should set the real ones.
export const SIZES = [
  { id: 'small', cm: '20 × 25 cm', from: 1500 },
  { id: 'medium', cm: '30 × 40 cm', from: 2500 },
  { id: 'large', cm: '40 × 50 cm', from: 3500 },
];

export const OCCASIONS = ['none', 'birthday', 'wedding', 'womensDay', 'christmas', 'other'];

// type → colours → size → extras → check and send
export const STEP_COUNT = 5;

/**
 * @typedef {object} CustomChoices
 * @property {string | null} type
 * @property {string | null} palette  a PALETTES id ('custom' = picked below), or 'same' (colours of the piece it started from)
 * @property {string[]} colors  COLORS ids picked when palette is 'custom'
 * @property {string | null} size
 * @property {string} occasion
 * @property {string} message  words to write on the piece
 * @property {string} deadline  yyyy-mm-dd, or ''
 * @property {string} note
 * @property {string} name
 */

/**
 * @typedef {object} CustomOrderViewProps
 * @property {number} step  0-based
 * @property {CustomChoices} choices
 * @property {import('../../lib/catalog').Piece | null} fromPiece  the piece it started from, if any
 * @property {{ id: string, colors: string[], photo?: string }[]} palettes
 * @property {boolean} pickingColors  showing the single-colour grid
 * @property {(id: string) => void} onPickPalette
 * @property {(id: string) => void} onToggleColor
 * @property {(size: { from: number }) => string} sizePrice  "from 1.500 ден."
 * @property {{ label: string, value: string }[]} summary
 * @property {{ id: string, href: string, label: string, external: boolean }[]} channels
 * @property {(field: string, value: string) => void} onChoose  pick and go to the next step
 * @property {(field: string, value: string) => void} onFieldChange
 * @property {() => void} onNext
 * @property {() => void} onBack
 * @property {() => void} onClose
 * @property {(event: import('react').MouseEvent) => void} onBackdropClick
 */
