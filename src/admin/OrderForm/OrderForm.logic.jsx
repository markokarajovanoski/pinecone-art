import { useState } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import OrderFormView from './OrderForm.view';
import { EMPTY_ORDER } from './OrderForm.props';

const blankToNull = (value) => value.trim() || null;

/** @param {import('./OrderForm.props').OrderFormProps} props */
export default function OrderForm({ designs, onSave, onClose }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_ORDER);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!form.customer_name.trim() || !form.phone.trim()) {
      setError(t('admin.orderForm.required'));
      return;
    }
    const design = designs.find((d) => String(d.id) === form.design_id);
    const quantity = Math.max(1, Math.round(Number(form.quantity) || 1));
    // An empty price takes the design's price times the quantity.
    const agreed = form.items_total.trim() === '' ? null : Math.round(Number(form.items_total));
    const total = agreed ?? (design?.price != null ? design.price * quantity : null);

    setSaving(true);
    setError(null);
    try {
      await onSave(
        {
          customer_name: form.customer_name.trim(),
          phone: form.phone.trim(),
          city: blankToNull(form.city),
          address: blankToNull(form.address),
          postal_code: blankToNull(form.postal_code),
          details: blankToNull(form.details),
          items_total: total,
          payment_method: form.payment_method,
          note: blankToNull(form.note),
        },
        design ? { piece_id: design.id, price: design.price ?? 0, quantity } : null
      );
    } catch (e) {
      setError(t('admin.error', { message: e.message }));
      setSaving(false);
    }
  };

  return (
    <OrderFormView
      designs={designs}
      form={form}
      saving={saving}
      error={error}
      onFieldChange={(name, value) => setForm((current) => ({ ...current, [name]: value }))}
      onSave={handleSave}
      onClose={onClose}
    />
  );
}
