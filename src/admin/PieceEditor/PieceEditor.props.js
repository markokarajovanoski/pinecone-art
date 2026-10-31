/**
 * @typedef {import('../PieceManager/PieceManager.props').AdminPiece} AdminPiece
 */

/**
 * @typedef {object} PieceEditorProps
 * @property {AdminPiece | null} piece  null when adding a new piece
 * @property {{ id: number, name: string }[]} categories
 * @property {string[]} takenSlugs  links already used by other pieces
 * @property {(id: number) => Promise<void>} onSaved
 * @property {() => Promise<void>} onChanged  photos changed; reload the piece
 * @property {() => void} onClose
 */

/**
 * @typedef {object} PieceEditorViewProps
 * @property {AdminPiece | null} piece
 * @property {{ id: number, name: string }[]} categories
 * @property {Record<string, string>} form
 * @property {null | 'saving' | 'uploading' | 'deleting'} busy
 * @property {{ type: 'ok' | 'error', text: string } | null} message
 * @property {{ done: number, total: number } | null} progress  photo upload progress
 * @property {(name: string, value: string) => void} onFieldChange
 * @property {(event: import('react').FormEvent) => void} onSave
 * @property {() => void} onDelete
 * @property {(files: FileList) => void} onAddPhotos
 * @property {(photo: AdminPiece['photos'][number]) => void} onMakeCover
 * @property {(photo: AdminPiece['photos'][number]) => void} onDeletePhoto
 * @property {() => void} onClose
 */
