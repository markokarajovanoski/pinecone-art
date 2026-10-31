import { useCallback, useEffect } from 'react';
import LightboxView from './Lightbox.view';

/** @param {import('./Lightbox.props').LightboxProps} props */
export default function Lightbox({
  pieces,
  currentIndex,
  currency,
  onClose,
  onNext,
  onPrev,
  onOrder,
  onShare,
  keysEnabled,
}) {
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

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <LightboxView
      piece={pieces[currentIndex]}
      hasNavigation={pieces.length > 1}
      currency={currency}
      onClose={onClose}
      onNext={onNext}
      onPrev={onPrev}
      onOrder={onOrder}
      onShare={onShare}
      onBackdropClick={handleBackdropClick}
    />
  );
}
