import { useId } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import { MAX_QUANTITY } from './OrderRequestForm.props';
import './style.css';

/** @param {import('./OrderRequestForm.props').OrderRequestFormViewProps} props */
export default function OrderRequestFormView({
  form,
  showQuantity,
  state,
  error,
  fieldErrors,
  onFieldChange,
  onSubmit,
}) {
  const { t } = useLanguage();
  const idPrefix = useId();
  const field = (name) => ({
    name,
    value: form[name],
    onChange: (e) => onFieldChange(name, e.target.value),
    'aria-invalid': fieldErrors[name] ? true : undefined,
    'aria-describedby': fieldErrors[name] ? `${idPrefix}-${name}` : undefined,
  });
  // The message under a wrong field; screen readers read it with the field.
  const fieldError = (name) =>
    fieldErrors[name] && (
      <span id={`${idPrefix}-${name}`} className="order-request-field-error">
        {fieldErrors[name]}
      </span>
    );

  if (state === 'sent') {
    return (
      <div className="order-request-sent" role="status">
        <span className="order-request-check" aria-hidden="true">✓</span>
        <strong>{t('orderForm.sentTitle')}</strong>
        <p>{t('orderForm.sentText')}</p>
      </div>
    );
  }

  return (
    <form className="order-request" onSubmit={onSubmit} noValidate>
      <label className="order-request-field">
        <span>{t('orderForm.name')}</span>
        <input type="text" autoComplete="name" maxLength={120} {...field('name')} />
        {fieldError('name')}
      </label>
      <label className="order-request-field">
        <span>{t('orderForm.phone')}</span>
        <input type="tel" autoComplete="tel" inputMode="tel" maxLength={25} {...field('phone')} />
        {fieldError('phone')}
      </label>
      <label className="order-request-field">
        <span>{t('orderForm.city')}</span>
        <input type="text" autoComplete="address-level2" maxLength={80} {...field('city')} />
        {fieldError('city')}
      </label>
      <label className="order-request-field">
        <span>{t('orderForm.address')}</span>
        <input type="text" autoComplete="street-address" maxLength={200} {...field('address')} />
        {fieldError('address') || <span className="order-request-hint">{t('orderForm.addressHint')}</span>}
      </label>
      {showQuantity && (
        <label className="order-request-field">
          <span>{t('orderForm.quantity')}</span>
          <input type="number" inputMode="numeric" min="1" max={MAX_QUANTITY} step="1" {...field('quantity')} />
          {fieldError('quantity')}
        </label>
      )}
      <label className="order-request-field">
        <span>{t('orderForm.note')}</span>
        <textarea rows={2} maxLength={1000} {...field('note')} />
      </label>

      {/* Hidden from people; spam bots fill it in and their order is dropped. */}
      <label className="order-request-trap" aria-hidden="true">
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...field('website')} />
      </label>

      {error && <p className="order-request-error" role="alert">{error}</p>}
      <button type="submit" className="order-request-submit" disabled={state === 'sending'}>
        {state === 'sending' ? t('orderForm.sending') : t('orderForm.submit')}
      </button>
      <p className="order-request-pay">{t('orderForm.payNote')}</p>
    </form>
  );
}
