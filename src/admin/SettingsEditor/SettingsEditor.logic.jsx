import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import { fetchSettings, saveSettings } from '../adminApi';
import SettingsEditorView from './SettingsEditor.view';

// Form strings → database values; empty fields become null.
function toValues(form) {
  const values = {};
  for (const [name, value] of Object.entries(form)) values[name] = value.trim() || null;
  values.currency = (values.currency ?? 'MKD').toUpperCase();
  values.shipping_fee = values.shipping_fee === null ? null : Math.round(Number(values.shipping_fee));
  return values;
}

export default function SettingsEditor() {
  const { t } = useLanguage();
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings()
      .then((settings) =>
        setForm(Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, v == null ? '' : String(v)])))
      )
      .catch((e) => setLoadError(e.message));
  }, []);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings(toValues(form));
      setMessage({ type: 'ok', text: t('admin.editor.saved') });
    } catch (e) {
      setMessage({ type: 'error', text: t('admin.error', { message: e.message }) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsEditorView
      form={form}
      loadError={loadError}
      saving={saving}
      message={message}
      onFieldChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
      onSave={handleSave}
    />
  );
}
