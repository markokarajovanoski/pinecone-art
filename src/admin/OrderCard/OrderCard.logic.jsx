import { useState } from 'react';
import { useLanguage } from '../../i18n/languageContext';
import { priceLabel } from '../../lib/catalog';
import OrderCardView from './OrderCard.view';
import { NEXT_STEP } from './OrderCard.props';

const formatDate = (iso) => iso.slice(0, 10).split('-').reverse().join('.');

/** @param {import('./OrderCard.props').OrderCardProps} props */
export default function OrderCard({ order, onUpdate, onDelete }) {
  const { t } = useLanguage();
  const [tracking, setTracking] = useState(order.tracking_number ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(t('admin.error', { message: e.message }));
    } finally {
      setBusy(false);
    }
  };

  const next = NEXT_STEP[order.status];
  const handleNextStep = () =>
    run(() =>
      onUpdate(order, next === 'shipped' ? { status: next, tracking_number: tracking.trim() || null } : { status: next })
    );

  const handleCancel = () => {
    if (window.confirm(t('admin.orders.cancelConfirm', { name: order.customer_name }))) {
      run(() => onUpdate(order, { status: 'cancelled' }));
    }
  };

  const handleDelete = () => {
    if (window.confirm(t('admin.orders.deleteConfirm', { name: order.customer_name }))) {
      run(() => onDelete(order));
    }
  };

  // Prices are saved in denars; the family always sees denars, whatever the admin language.
  const priceText =
    order.items_total == null ? null : priceLabel({ price: order.items_total, status: 'available' }, 'MKD', t, 'mk');

  return (
    <OrderCardView
      order={order}
      date={formatDate(order.created_at)}
      priceText={priceText}
      tracking={tracking}
      busy={busy}
      error={error}
      onTrackingChange={setTracking}
      onNextStep={handleNextStep}
      onCancel={handleCancel}
      onReopen={() => run(() => onUpdate(order, { status: 'new' }))}
      onDelete={handleDelete}
    />
  );
}
