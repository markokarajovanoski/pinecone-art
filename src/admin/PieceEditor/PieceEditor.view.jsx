import { useLanguage } from '../../i18n/languageContext';
import { STATUSES } from '../PieceManager/PieceManager.props';

const SIZE_FIELDS = ['width_cm', 'height_cm', 'depth_cm', 'weight_g'];
const SIZE_LABELS = { width_cm: 'width', height_cm: 'height', depth_cm: 'depth', weight_g: 'weight' };

/** @param {import('./PieceEditor.props').PieceEditorViewProps} props */
export default function PieceEditorView({
  piece,
  categories,
  form,
  busy,
  message,
  progress,
  onFieldChange,
  onSave,
  onDelete,
  onAddPhotos,
  onMakeCover,
  onDeletePhoto,
  onClose,
}) {
  const { t } = useLanguage();
  const field = (name) => ({
    value: form[name],
    onChange: (e) => onFieldChange(name, e.target.value),
  });

  return (
    <section className="admin-editor">
      <button type="button" className="admin-btn admin-btn-plain" onClick={onClose}>
        {t('admin.editor.back')}
      </button>
      <h1 className="admin-heading">{piece ? piece.title : t('admin.editor.newTitle')}</h1>

      <form className="admin-card admin-form" onSubmit={onSave}>
        <label className="admin-field">
          <span>{t('admin.editor.title')}</span>
          <input type="text" required {...field('title')} />
        </label>
        <label className="admin-field">
          <span>{t('admin.editor.description')}</span>
          <textarea rows={3} {...field('description')} />
        </label>
        <label className="admin-field">
          <span>{t('admin.editor.category')}</span>
          <select {...field('category_id')}>
            {categories.map((category) => {
              const key = `category.${category.slug}`;
              const label = t(key);
              return (
                <option key={category.id} value={category.id}>
                  {label === key ? category.name : label}
                </option>
              );
            })}
          </select>
        </label>
        <label className="admin-field">
          <span>{t('admin.editor.price')}</span>
          <input type="number" inputMode="numeric" min="1" step="1" {...field('price')} />
          <small className="admin-muted">{t('admin.editor.priceHint')}</small>
        </label>
        <label className="admin-field">
          <span>{t('admin.editor.status')}</span>
          <select {...field('status')}>
            {STATUSES.map((status) => (
              <option key={status} value={status}>{t(`admin.status.${status}`)}</option>
            ))}
          </select>
        </label>
        <div className="admin-row">
          {SIZE_FIELDS.map((name) => (
            <label key={name} className="admin-field">
              <span>{t(`admin.editor.${SIZE_LABELS[name]}`)}</span>
              <input type="number" inputMode="decimal" min="0" step="any" {...field(name)} />
            </label>
          ))}
        </div>
        {message && (
          <p className={message.type === 'ok' ? 'admin-ok' : 'admin-error'}>{message.text}</p>
        )}
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-wide" disabled={busy !== null}>
          {busy === 'saving' ? t('admin.editor.saving') : t('admin.editor.save')}
        </button>
      </form>

      <div className="admin-card">
        <h2 className="admin-subheading">{t('admin.photos.title')}</h2>
        {!piece && <p className="admin-muted">{t('admin.photos.saveFirst')}</p>}
        {piece && (
          <>
            <ul className="admin-photos">
              {piece.photos.map((photo, index) => (
                <li key={photo.id} className="admin-photo">
                  <img src={photo.src} alt={photo.alt_text ?? ''} />
                  {index === 0 ? (
                    <span className="admin-cover-badge">{t('admin.photos.cover')}</span>
                  ) : (
                    <button type="button" className="admin-btn" disabled={busy !== null} onClick={() => onMakeCover(photo)}>
                      {t('admin.photos.makeCover')}
                    </button>
                  )}
                  <button type="button" className="admin-btn admin-btn-danger" disabled={busy !== null} onClick={() => onDeletePhoto(photo)}>
                    {t('admin.photos.delete')}
                  </button>
                </li>
              ))}
            </ul>
            <label className={`admin-btn admin-btn-primary admin-btn-wide admin-upload${busy !== null ? ' disabled' : ''}`}>
              {progress
                ? t('admin.photos.uploading', { done: Math.min(progress.done + 1, progress.total), total: progress.total })
                : t('admin.photos.add')}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={busy !== null}
                onChange={(e) => {
                  onAddPhotos(e.target.files);
                  e.target.value = '';
                }}
              />
            </label>
          </>
        )}
      </div>

      {piece && (
        <button type="button" className="admin-btn admin-btn-danger admin-btn-wide" disabled={busy !== null} onClick={onDelete}>
          {t('admin.editor.delete')}
        </button>
      )}
    </section>
  );
}
