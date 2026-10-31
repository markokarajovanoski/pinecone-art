import { useLanguage } from '../../i18n/languageContext';
import PieceEditor from '../PieceEditor';
import { STATUSES } from './PieceManager.props';

/** @param {import('./PieceManager.props').PieceManagerViewProps} props */
export default function PieceManagerView({
  data,
  error,
  isEditing,
  editingPiece,
  onAdd,
  onEdit,
  onStatusChange,
  onEditorSaved,
  onEditorChanged,
  onEditorClose,
}) {
  const { t } = useLanguage();

  if (error) return <p className="admin-error">{t('admin.error', { message: error })}</p>;
  if (!data) return <p className="admin-note">{t('admin.loading')}</p>;

  if (isEditing) {
    return (
      <PieceEditor
        piece={editingPiece}
        categories={data.categories}
        takenSlugs={data.pieces.map((p) => p.slug)}
        onSaved={onEditorSaved}
        onChanged={onEditorChanged}
        onClose={onEditorClose}
      />
    );
  }

  return (
    <section>
      <button type="button" className="admin-btn admin-btn-primary admin-btn-wide" onClick={onAdd}>
        {t('admin.pieces.add')}
      </button>
      {data.pieces.length === 0 && <p className="admin-note">{t('admin.pieces.empty')}</p>}
      <ul className="admin-pieces">
        {data.pieces.map((piece) => (
          <li key={piece.id} className="admin-card admin-piece">
            <div className="admin-piece-top">
              {piece.photos[0] ? (
                <img src={piece.photos[0].src} alt="" className="admin-thumb" />
              ) : (
                <span className="admin-thumb admin-thumb-empty">{t('admin.pieces.noPhoto')}</span>
              )}
              <div className="admin-piece-info">
                <strong>{piece.title}</strong>
                <span className="admin-muted">{piece.price ?? '—'}</span>
              </div>
              <button type="button" className="admin-btn" onClick={() => onEdit(piece)}>
                {t('admin.pieces.edit')}
              </button>
            </div>
            <div className="admin-statuses" role="group" aria-label={t('admin.editor.status')}>
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`admin-status admin-status-${status}${piece.status === status ? ' active' : ''}`}
                  aria-pressed={piece.status === status}
                  onClick={() => piece.status !== status && onStatusChange(piece, status)}
                >
                  {t(`admin.status.${status}`)}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
