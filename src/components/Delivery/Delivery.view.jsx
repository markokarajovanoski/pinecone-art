import { useLanguage } from '../../i18n/languageContext';
import './style.css';

export default function DeliveryView() {
  const { t } = useLanguage();

  return (
    <section className="delivery-section">
      <div className="delivery-container reveal">
        <div className="delivery-icon">📦</div>
        <div className="delivery-content">
          <h3 className="delivery-title">{t('delivery.title')}</h3>
          <p className="delivery-text">
            {t('delivery.before')} <strong>Kargo</strong>
            {t('delivery.after')}
          </p>
        </div>
        <div className="delivery-badge">
          <span>{t('delivery.shipsWith')}</span>
          <strong>KARGO</strong>
        </div>
      </div>
    </section>
  );
}
