/**
 * @typedef {'order' | 'share'} SheetMode
 *   order: message the family about the piece; share: send it to a friend
 */

/**
 * @typedef {object} ContactSheetProps
 * @property {SheetMode} mode
 * @property {import('../../lib/catalog').Piece} piece
 * @property {() => void} onClose
 */

/**
 * A ready-to-tap link: chat, call or share.
 * @typedef {object} Channel
 * @property {string} id  viber, whatsapp, messenger, call or facebook (also the button colour)
 * @property {string} href
 * @property {string} label
 * @property {boolean} external  opens in a new tab
 */

/**
 * @typedef {object} ContactSheetViewProps
 * @property {SheetMode} mode
 * @property {string} title
 * @property {import('../../lib/catalog').Piece} piece
 * @property {string} priceText
 * @property {Channel[]} channels
 * @property {boolean} copied  the link was just copied
 * @property {() => void} onCopy
 * @property {() => void} onClose
 * @property {(event: import('react').MouseEvent) => void} onBackdropClick
 */
