// Translation key for the Order button, by piece status.
export const ORDER_LABELS = {
  available: 'order.button',
  reserved: 'order.askButton',
  sold: 'gallery.askSimilar',
};

/**
 * @typedef {object} PieceActionsViewProps
 * @property {import('../../lib/catalog').Piece} piece
 * @property {(piece: import('../../lib/catalog').Piece) => void} onOrder
 * @property {(piece: import('../../lib/catalog').Piece) => void} onShare
 * @property {string} [className]  extra class, e.g. for the lightbox's dark background
 */
