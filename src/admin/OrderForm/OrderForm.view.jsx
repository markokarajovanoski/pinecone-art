import { useLanguage } from '../../i18n/languageContext';
import { PAYMENT_METHODS } from './OrderForm.props';

/** @param {import('./OrderForm.props').OrderFormViewProps} props */
export default function OrderFormView({ designs, form, saving, error, onFieldChange, onSave, onClose }) {
  const { t } = useLanguage();
  const field = (name) => ({ value: form[name], onChange: (e) => onFieldChange(name, e.target.value) });

  return (
    <section>
      <button type="button" className="admin-btn admin-btn-plain" onClick={onClose}>
        {t('admin.editor.back')}
      </button>
      <h1 className="admin-heading">{t('admin.orderForm.title')}</h1>

      <form className="admin-card admin-form" onSubmit={onSave}>
        <label className="admin-field">
          <span>{t('admin.orderForm.name')} *</span>
          <input type="text" autoComplete="off" {...field('customer_name')} />
        </label>
        <label className="admin-field">
          <span>{t('admin.orderForm.phone')} *</span>
          <input type="tel" inputMode="tel" autoComplete="off" {...field('phone')} />
        </label>

        <label className="admin-field">
          <span>{t('admin.orderForm.design')}</span>
          <select {...field('design_id')}>
            <option value="">{t('admin.orderForm.noDesign')}</option>
            {designs.map((design) => (
              <option key={design.id} value={design.id}>{design.title}</option>
            ))}
          </select>
        </label>
        {form.design_id && (
          <label className="admin-field">
            <span>{t('admin.orderForm.quantity')}</span>
            <input type="number" inputMode="numeric" min="1" max="50" step="1" {...field('quantity')} />
          </label>
        )}
        <label className="admin-field">
          <span>{t('admin.orderForm.details')}</span>
          <textarea rows={3} placeholder={t('admin.orderForm.detailsHint')} {...field('details')} />
        </label>

        <label className="admin-field">
          <span>{t('admin.orderForm.price')}</span>
          <input type="number" inputMode="numeric" min="0" step="1" {...field('items_total')} />
          <small className="admin-muted">{t('admin.orderForm.priceHint')}</small>
        </label>
        <label className="admin-field">
          <span>{t('admin.orderForm.payment')}</span>
          <select {...field('payment_method')}>
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>{t(`admin.orders.payment.${method}`)}</option>
            ))}
          </select>
        </label>

        <div className="admin-row">
          <label className="admin-field">
            <span>{t('admin.orderForm.city')}</span>
            <input type="text" {...field('city')} />
          </label>
          <label className="admin-field">
            <span>{t('admin.orderForm.postalCode')}</span>
            <input type="text" inputMode="numeric" {...field('postal_code')} />
          </label>
        </div>
        <label className="admin-field">
          <span>{t('admin.orderForm.address')}</span>
          <input type="text" {...field('address')} />
        </label>
        <label className="admin-field">
          <span>{t('admin.orderForm.note')}</span>
          <textarea rows={2} {...field('note')} />
        </label>

        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn admin-btn-primary admin-btn-wide" disabled={saving}>
          {saving ? t('admin.editor.saving') : t('admin.orderForm.save')}
        </button>
      </form>
    </section>
  );
}
