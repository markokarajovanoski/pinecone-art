import { useState } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import { submitOrder } from '../../lib/orders';
import OrderRequestFormView from './OrderRequestForm.view';
import { EMPTY_FORM, MAX_QUANTITY } from './OrderRequestForm.props';
import { validateOrder } from './OrderRequestForm.utils';

// Database error codes → what the buyer is told.
const ERROR_MESSAGES = {
  PT429: 'orderForm.tooMany',
  22023: 'orderForm.invalid', // a field the order function rejected
  23514: 'orderForm.invalid', // a table check failed
};

/** @param {import('./OrderRequestForm.props').OrderRequestFormProps} props */
export default function OrderRequestForm({ piece = null, details = null, showQuantity = false }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null); // translation keys, so a language switch updates them
  const [fieldErrors, setFieldErrors] = useState({});

  const changeField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    // Typing in a field clears its message; the summary goes once no field is marked.
    if (!fieldErrors[name]) return;
    const rest = { ...fieldErrors };
    delete rest[name];
    setFieldErrors(rest);
    if (Object.keys(rest).length === 0) setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateOrder(form, showQuantity);
    const wrongFields = Object.keys(errors);
    setFieldErrors(errors);
    if (wrongFields.length > 0) {
      setError('orderForm.checkFields');
      event.currentTarget.elements[wrongFields[0]]?.focus(); // scrolls the first one into view
      return;
    }
    setState('sending');
    setError(null);
    try {
      await submitOrder({
        name: form.name.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        pieceId: piece?.id,
        quantity: showQuantity ? Number(form.quantity) : 1,
        details,
        note: form.note.trim(),
        website: form.website,
      });
      setState('sent');
    } catch (e) {
      setError(ERROR_MESSAGES[e.code] ?? 'orderForm.failed');
      setState('idle');
    }
  };

  const translatedFieldErrors = Object.fromEntries(
    Object.entries(fieldErrors).map(([name, key]) => [name, t(key, { max: MAX_QUANTITY })]),
  );

  return (
    <OrderRequestFormView
      form={form}
      showQuantity={showQuantity}
      state={state}
      error={error && t(error)}
      fieldErrors={translatedFieldErrors}
      onFieldChange={changeField}
      onSubmit={handleSubmit}
    />
  );
}
