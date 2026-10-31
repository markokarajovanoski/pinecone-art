// Statuses that get a badge on the photo.
export const BADGE_STATUSES = ['reserved', 'sold'];

/**
 * @typedef {object} PieceCardViewProps
 * @property {import('../../lib/catalog').Piece} piece
 * @property {string} currency  ISO code, e.g. MKD
 * @property {() => void} onOpen  open the piece in the lightbox
 * @property {(piece: import('../../lib/catalog').Piece) => void} onOrder
 * @property {(piece: import('../../lib/catalog').Piece) => void} onShare
 */
