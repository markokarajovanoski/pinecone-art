// An order's path. Pieces are made to order, so "confirmed" means it's being made.
export const ORDER_FLOW = ['new', 'confirmed', 'shipped', 'delivered'];

// Filter chips: "active" = everything still to do.
export const FILTERS = ['active', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'all'];
export const ACTIVE_STATUSES = ['new', 'confirmed', 'shipped'];

/**
 * @typedef {object} AdminOrder
 * @property {number} id
 * @property {'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'} status
 * @property {string} customer_name
 * @property {string} phone
 * @property {string | null} city
 * @property {string | null} address
 * @property {string | null} postal_code
 * @property {string | null} note
 * @property {string | null} details  what to make
 * @property {'cash_on_delivery' | 'bank_transfer'} payment_method
 * @property {number | null} items_total  agreed price
 * @property {string | null} tracking_number
 * @property {string} created_at
 * @property {{ piece_id: number, quantity: number, price: number, title: string, photo: string | null }[]} items
 */

/**
 * @typedef {object} OrderManagerViewProps
 * @property {AdminOrder[] | null} orders  null while loading
 * @property {{ id: number, title: string, price: number | null }[]} designs
 * @property {string | null} error
 * @property {string} filter
 * @property {Record<string, number>} counts  orders per filter
 * @property {boolean} adding  showing the new-order form
 * @property {(filter: string) => void} onFilter
 * @property {() => void} onAdd
 * @property {() => void} onCloseForm
 * @property {(fields: object, item: object | null) => Promise<void>} onCreate
 * @property {(order: AdminOrder, fields: object) => Promise<void>} onUpdate
 * @property {(order: AdminOrder) => Promise<void>} onDelete
 */
