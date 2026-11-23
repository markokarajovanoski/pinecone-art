export const MAX_QUANTITY = 20; // same limit as submit_order

export const EMPTY_FORM = {
  name: '',
  phone: '',
  city: '',
  address: '',
  quantity: '1',
  note: '',
  website: '', // hidden field that only bots fill in
};

/**
 * @typedef {object} OrderRequestFormProps
 * @property {import('../../lib/catalog').Piece | null} [piece]  the design being ordered
 * @property {string | null} [details]  what to make (custom orders)
 * @property {boolean} [showQuantity]
 */

/**
 * @typedef {object} OrderRequestFormViewProps
 * @property {Record<string, string>} form
 * @property {boolean} showQuantity
 * @property {'idle' | 'sending' | 'sent'} state
 * @property {string | null} error  shown above the send button
 * @property {Record<string, string>} fieldErrors  field name → message, shown under that field
 * @property {(name: string, value: string) => void} onFieldChange
 * @property {(event: import('react').FormEvent) => void} onSubmit
 */
