import { useLanguage } from '../../i18n/languageContext';
import OrderCard from '../OrderCard';
import OrderForm from '../OrderForm';
import { FILTERS } from './OrderManager.props';

/** @param {import('./OrderManager.props').OrderManagerViewProps} props */
export default function OrderManagerView({
  orders,
  designs,
  error,
  filter,
  counts,
  adding,
  onFilter,
  onAdd,
  onCloseForm,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const { t } = useLanguage();

  if (error) return <p className="admin-error">{t('admin.error', { message: error })}</p>;
  if (!orders) return <p className="admin-note">{t('admin.loading')}</p>;
  if (adding) return <OrderForm designs={designs} onSave={onCreate} onClose={onCloseForm} />;

  return (
    <section>
      <button type="button" className="admin-btn admin-btn-primary admin-btn-wide" onClick={onAdd}>
        {t('admin.orders.add')}
      </button>
      <div className="admin-filters" role="group" aria-label={t('admin.tabs.orders')}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`admin-filter${filter === f ? ' active' : ''}`}
            aria-pressed={filter === f}
            onClick={() => onFilter(f)}
          >
            {t(`admin.orders.filter.${f}`)} <span>{counts[f]}</span>
          </button>
        ))}
      </div>
      {orders.length === 0 && <p className="admin-note">{t('admin.orders.empty')}</p>}
      <ul className="admin-orders">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onUpdate={onUpdate} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );
}
