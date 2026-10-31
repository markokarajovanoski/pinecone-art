import { useEffect, useCallback } from 'react';
import { priceLabel } from '../lib/catalog';
import { useLanguage } from '../i18n/languageContext';

export default function Lightbox({
  pieces, currentIndex, currency, onClose, onNext, onPrev, onOrder, onShare, orderLabel, keysEnabled,
}) {
  const { lang, t } = useLanguage();
  const handleKeyDown = useCallback(
    (e) => {
      if (!keysEnabled) return; // the order/share sheet on top handles its own keys
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev, keysEnabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  const piece = pieces[currentIndex];
  const photo = piece.photos[0];

  return (
    <div className="lightbox active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" onClick={onClose} aria-label={t('lightbox.close')}>&times;</button>
      {pieces.length > 1 && (
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
        <div className="piece-actions lightbox-actions">
          <button type="button" className="order-btn" onClick={() => onOrder(piece)}>
            {orderLabel(piece)}
          </button>
          <button type="button" className="share-btn" onClick={() => onShare(piece)}>
            {t('share.button')}
          </button>
        </div>
      </div>
    </div>
  );
}
