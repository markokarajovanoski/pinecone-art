import { useLanguage } from '../../i18n/languageContext';
import { FIELDS } from './SettingsEditor.props';

/** @param {import('./SettingsEditor.props').SettingsEditorViewProps} props */
export default function SettingsEditorView({ form, loadError, saving, message, onFieldChange, onSave }) {
  const { t } = useLanguage();

  if (loadError) return <p className="admin-error">{t('admin.error', { message: loadError })}</p>;
  if (!form) return <p className="admin-note">{t('admin.loading')}</p>;

  return (
    <form className="admin-card admin-form" onSubmit={onSave}>
      {FIELDS.map(({ name, type }) => (
        <label key={name} className="admin-field">
          <span>{t(`admin.settings.${name}`)}</span>
          <input
            type={type}
            value={form[name]}
            onChange={(e) => onFieldChange(name, e.target.value)}
            {...(type === 'number' ? { min: 0, step: 1, inputMode: 'numeric' } : {})}
          />
        </label>
      ))}
      {message && <p className={message.type === 'ok' ? 'admin-ok' : 'admin-error'}>{message.text}</p>}
      <button type="submit" className="admin-btn admin-btn-primary admin-btn-wide" disabled={saving}>
        {saving ? t('admin.editor.saving') : t('admin.editor.save')}
      </button>
    </form>
  );
}
