import { useCustomOrder } from '../../context/customOrderContext';
import { useLanguage } from '../../i18n/languageContext';
import './style.css';

// Last tile of the gallery: the pieces are only examples, anything can be made to order.
export default function IdeaCardView() {
  const { t } = useLanguage();
  const openCustomOrder = useCustomOrder();

  return (
    <div className="gallery-item reveal">
      <button type="button" className="gallery-card idea-card" onClick={() => openCustomOrder()}>
        <span className="idea-art" aria-hidden="true">
          <i />
          <i />
          <i />
          <b>+</b>
        </span>
        <span className="idea-info">
          <strong>{t('gallery.idea.title')}</strong>
          <span>{t('gallery.idea.text')}</span>
          <span className="idea-btn">{t('custom.cta')}</span>
        </span>
      </button>
    </div>
  );
}
