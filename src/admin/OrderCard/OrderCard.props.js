// The button that moves an order one step along, per status.
export const NEXT_STEP = {
  new: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
};

/**
 * @typedef {import('../OrderManager/OrderManager.props').AdminOrder} AdminOrder
 */

/**
 * @typedef {object} OrderCardProps
 * @property {AdminOrder} order
 * @property {(order: AdminOrder, fields: object) => Promise<void>} onUpdate
 * @property {(order: AdminOrder) => Promise<void>} onDelete
 */

/**
 * @typedef {object} OrderCardViewProps
 * @property {AdminOrder} order
 * @property {string} date  dd.mm.yyyy
 * @property {string | null} priceText
 * @property {string} tracking  the tracking number being typed
 * @property {boolean} busy
 * @property {string | null} error
 * @property {(value: string) => void} onTrackingChange
 * @property {() => void} onNextStep
 * @property {() => void} onCancel
 * @property {() => void} onReopen
 * @property {() => void} onDelete
 */
