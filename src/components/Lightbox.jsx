import { useEffect, useCallback } from 'react';

export default function Lightbox({ images, currentIndex, onClose, onNext, onPrev }) {
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

  const image = images[currentIndex];

  return (
    <div className="lightbox active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">&times;</button>
      <button className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label="Previous">&#10094;</button>
      <button className="lightbox-nav lightbox-next" onClick={onNext} aria-label="Next">&#10095;</button>
      <div className="lightbox-content">
        <img src={image.src} alt={image.alt} />
        <div className="lightbox-caption">{image.title}</div>
      </div>
    </div>
  );
}
