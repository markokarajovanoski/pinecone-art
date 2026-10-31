// Statuses the family can set, in the order the buttons appear.
export const STATUSES = ['draft', 'available', 'reserved', 'sold'];

/**
 * A piece as the admin panel loads it (all columns, drafts included).
 * @typedef {object} AdminPiece
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string | null} description
 * @property {number} category_id
 * @property {number | null} price
 * @property {'draft' | 'available' | 'reserved' | 'sold'} status
 * @property {number | null} width_cm
 * @property {number | null} height_cm
 * @property {number | null} depth_cm
 * @property {number | null} weight_g
 * @property {{ id: number, path: string, src: string, alt_text: string | null, position: number }[]} photos
 */

/**
 * @typedef {object} PieceManagerViewProps
 * @property {{ categories: { id: number, name: string }[], pieces: AdminPiece[] } | null} data  null while loading
 * @property {string | null} error
 * @property {boolean} isEditing
 * @property {AdminPiece | null} editingPiece  null when adding a new piece
 * @property {() => void} onAdd
 * @property {(piece: AdminPiece) => void} onEdit
 * @property {(piece: AdminPiece, status: string) => void} onStatusChange
 * @property {(id: number) => Promise<void>} onEditorSaved
 * @property {() => Promise<void>} onEditorChanged
 * @property {() => void} onEditorClose
 */
