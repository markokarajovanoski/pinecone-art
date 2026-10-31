export const PAYMENT_METHODS = ['cash_on_delivery', 'bank_transfer'];

export const EMPTY_ORDER = {
  customer_name: '',
  phone: '',
  city: '',
  address: '',
  postal_code: '',
  design_id: '',
  quantity: '1',
  details: '',
  items_total: '',
  payment_method: 'cash_on_delivery',
  note: '',
};

/**
 * @typedef {object} OrderFormProps
 * @property {{ id: number, title: string, price: number | null }[]} designs
 * @property {(fields: object, item: object | null) => Promise<void>} onSave
 * @property {() => void} onClose
 */

/**
 * @typedef {object} OrderFormViewProps
 * @property {{ id: number, title: string, price: number | null }[]} designs
 * @property {Record<string, string>} form
 * @property {boolean} saving
 * @property {string | null} error
 * @property {(name: string, value: string) => void} onFieldChange
 * @property {(event: import('react').FormEvent) => void} onSave
 * @property {() => void} onClose
 */
