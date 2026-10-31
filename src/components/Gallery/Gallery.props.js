/**
 * @typedef {import('../../lib/catalog').Piece} Piece
 */

/**
 * @typedef {object} GalleryFilter
 * @property {string} label
 * @property {string} value  'all' or a category slug
 */

/**
 * @typedef {object} GalleryViewProps
 * @property {'loading' | 'ready' | 'error'} status
 * @property {GalleryFilter[]} filters
 * @property {string} activeFilter
 * @property {(value: string) => void} onSelectFilter
 * @property {Piece[]} pieces  the pieces in the current filter
 * @property {string} currency
 * @property {(index: number) => void} onOpenPiece
 * @property {number | null} lightboxIndex  index into pieces, or null when closed
 * @property {() => void} onCloseLightbox
 * @property {() => void} onNextPiece
 * @property {() => void} onPrevPiece
 * @property {(piece: Piece) => void} onOrder
 * @property {(piece: Piece) => void} onShare
 * @property {{ mode: 'order' | 'share', piece: Piece } | null} sheet
 * @property {() => void} onCloseSheet
 */
