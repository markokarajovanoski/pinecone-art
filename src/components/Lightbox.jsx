import { useEffect, useCallback } from 'react';
import { priceLabel } from '../lib/catalog';

export default function Lightbox({ pieces, currentIndex, currency, onClose, onNext, onPrev }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
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
      <button className="lightbox-close" onClick={onClose} aria-label="Close">&times;</button>
      {pieces.length > 1 && (
        <>
          <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Previous">&#10094;</button>
          <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Next">&#10095;</button>
        </>
      )}
      <div className="lightbox-content">
        <img src={photo.src} alt={photo.alt} />
        <div className="lightbox-caption">
          <span>{piece.title}</span>
          <span className="lightbox-price">{priceLabel(piece, currency)}</span>
        </div>
      </div>
    </div>
  );
}
