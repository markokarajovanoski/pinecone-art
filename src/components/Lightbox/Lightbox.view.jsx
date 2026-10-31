import { useLanguage } from '../../i18n/languageContext';
import { priceLabel } from '../../lib/catalog';
import PieceActions from '../PieceActions';
import './style.css';

/** @param {import('./Lightbox.props').LightboxViewProps} props */
export default function LightboxView({
  piece,
  hasNavigation,
  currency,
  onClose,
  onNext,
  onPrev,
  onOrder,
  onShare,
  onBackdropClick,
}) {
  const { lang, t } = useLanguage();
  const photo = piece.photos[0];

  return (
    <div className="lightbox active" onClick={onBackdropClick}>
      <button className="lightbox-close" onClick={onClose} aria-label={t('lightbox.close')}>&times;</button>
      {hasNavigation && (
        <>
          <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label={t('lightbox.previous')}>&#10094;</button>
          <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label={t('lightbox.next')}>&#10095;</button>
        </>
      )}
      <div className="lightbox-content">
        <img src={photo.src} alt={photo.alt} />
        <div className="lightbox-caption">
          <span>{piece.title}</span>
          <span className="lightbox-price">{priceLabel(piece, currency, t, lang)}</span>
        </div>
        <PieceActions piece={piece} onOrder={onOrder} onShare={onShare} className="lightbox-actions" />
      </div>
    </div>
  );
}
