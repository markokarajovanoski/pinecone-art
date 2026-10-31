import { useLanguage } from '../../i18n/languageContext';
import { NEXT_STEP } from './OrderCard.props';

/** @param {import('./OrderCard.props').OrderCardViewProps} props */
export default function OrderCardView({
  order,
  date,
  priceText,
  tracking,
  busy,
  error,
  onTrackingChange,
  onNextStep,
  onCancel,
  onReopen,
  onDelete,
}) {
  const { t } = useLanguage();
  const next = NEXT_STEP[order.status];
  const place = [order.address, order.postal_code, order.city].filter(Boolean).join(', ');

  return (
    <li className={`admin-card admin-order admin-order-${order.status}`}>
      <div className="admin-order-head">
        <span className="admin-muted">#{order.id} · {date}</span>
        <span className={`admin-order-status admin-order-status-${order.status}`}>
          {t(`admin.orders.status.${order.status}`)}
        </span>
      </div>

      <p className="admin-order-name">{order.customer_name}</p>
      <a href={`tel:${order.phone.replace(/[^\d+]/g, '')}`} className="admin-link">{order.phone}</a>
      <p className={place ? '' : 'admin-muted'}>{place || t('admin.orders.noAddress')}</p>

      {order.items.length > 0 && (
        <ul className="admin-order-items">
          {order.items.map((item) => (
            <li key={item.piece_id}>
              {item.photo && <img src={item.photo} alt="" />}
              <span>
                {item.title}
                {item.quantity > 1 && <strong> × {item.quantity}</strong>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {order.details && <p className="admin-order-details">{order.details}</p>}

      <p>
        {priceText && <strong>{priceText}</strong>}
        {priceText && ' · '}
        <span className="admin-muted">{t(`admin.orders.payment.${order.payment_method}`)}</span>
      </p>
      {order.note && <p className="admin-muted">{order.note}</p>}
      {order.tracking_number && order.status !== 'confirmed' && (
        <p>{t('admin.orders.trackingShown', { number: order.tracking_number })}</p>
      )}

      {order.status === 'confirmed' && (
        <label className="admin-field">
          <span>{t('admin.orders.tracking')}</span>
          <input type="text" value={tracking} onChange={(e) => onTrackingChange(e.target.value)} />
        </label>
      )}

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-order-actions">
        {next && (
          <button type="button" className="admin-btn admin-btn-primary" disabled={busy} onClick={onNextStep}>
            {t(`admin.orders.to.${next}`)}
          </button>
        )}
        {order.status === 'delivered' && <span className="admin-ok">{t('admin.orders.done')}</span>}
        {order.status === 'cancelled' && (
          <button type="button" className="admin-btn" disabled={busy} onClick={onReopen}>
            {t('admin.orders.reopen')}
          </button>
        )}
        {['new', 'confirmed'].includes(order.status) && (
          <button type="button" className="admin-btn" disabled={busy} onClick={onCancel}>
            {t('admin.orders.cancel')}
          </button>
        )}
        <button type="button" className="admin-btn admin-btn-plain admin-btn-danger-text" disabled={busy} onClick={onDelete}>
          {t('admin.orders.delete')}
        </button>
      </div>
    </li>
  );
}
