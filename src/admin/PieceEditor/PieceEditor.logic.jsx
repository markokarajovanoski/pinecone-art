import { useState } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import { deletePhoto, deletePiece, makeCover, savePiece, uploadPhotos } from '../adminApi';
import PieceEditorView from './PieceEditor.view';
import { toFields, toForm, uniqueSlug } from './PieceEditor.utils';

/** @param {import('./PieceEditor.props').PieceEditorProps} props */
export default function PieceEditor({ piece, categories, takenSlugs, onSaved, onChanged, onClose }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(() => toForm(piece, categories));
  const [busy, setBusy] = useState(null);
  const [message, setMessage] = useState(null);
  const [progress, setProgress] = useState(null);

  const errorText = (e) =>
    e.code === '23503' ? t('admin.editor.deleteBlocked') : t('admin.error', { message: e.message });

  // Runs one database action with a busy state and a message for the result.
  const run = async (kind, action, okText) => {
    setBusy(kind);
    setMessage(null);
    try {
      await action();
      if (okText) setMessage({ type: 'ok', text: okText });
    } catch (e) {
      setMessage({ type: 'error', text: errorText(e) });
    } finally {
      setBusy(null);
      setProgress(null);
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: t('admin.editor.titleRequired') });
      return;
    }
    run(
      'saving',
      async () => {
        const fields = toFields(form);
        if (!piece) fields.slug = uniqueSlug(form.title, takenSlugs);
        const saved = await savePiece({ id: piece?.id, ...fields });
        await onSaved(saved.id);
      },
      t('admin.editor.saved')
    );
  };

  const handleDelete = () => {
    if (!window.confirm(t('admin.editor.deleteConfirm', { title: piece.title }))) return;
    run('deleting', async () => {
      await deletePiece(piece);
      onClose();
    });
  };

  const handleAddPhotos = (fileList) => {
    const files = [...fileList];
    if (files.length === 0) return;
    run('uploading', async () => {
      await uploadPhotos(piece, files, (done, total) => setProgress({ done, total }));
      await onChanged();
    });
  };

  const handleDeletePhoto = (photo) => {
    if (!window.confirm(t('admin.photos.deleteConfirm'))) return;
    run('deleting', async () => {
      await deletePhoto(photo);
      await onChanged();
    });
  };

  const handleMakeCover = (photo) =>
    run('saving', async () => {
      await makeCover(piece, photo.id);
      await onChanged();
    });

  return (
    <PieceEditorView
      piece={piece}
      categories={categories}
      form={form}
      busy={busy}
      message={message}
      progress={progress}
      onFieldChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
      onSave={handleSave}
      onDelete={handleDelete}
      onAddPhotos={handleAddPhotos}
      onMakeCover={handleMakeCover}
      onDeletePhoto={handleDeletePhoto}
      onClose={onClose}
    />
  );
}
