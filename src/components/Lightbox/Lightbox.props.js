/**
 * @typedef {import('../../lib/catalog').Piece} Piece
 */

/**
 * @typedef {object} LightboxProps
 * @property {Piece[]} pieces  the pieces the arrows move through
 * @property {number} currentIndex
 * @property {string} currency
 * @property {() => void} onClose
 * @property {() => void} onNext
 * @property {() => void} onPrev
 * @property {(piece: Piece) => void} onOrder
 * @property {(piece: Piece) => void} onShare
 * @property {boolean} keysEnabled  false while a sheet on top handles the keyboard
 */

/**
 * @typedef {object} LightboxViewProps
 * @property {Piece} piece
 * @property {boolean} hasNavigation  show the previous/next arrows
 * @property {string} currency
 * @property {() => void} onClose
 * @property {() => void} onNext
 * @property {() => void} onPrev
 * @property {(piece: Piece) => void} onOrder
 * @property {(piece: Piece) => void} onShare
 * @property {(event: import('react').MouseEvent) => void} onBackdropClick
 */
