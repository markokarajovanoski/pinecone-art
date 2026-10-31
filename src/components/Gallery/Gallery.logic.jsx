import { useEffect, useMemo, useRef, useState } from 'react';
import { useCatalog } from '../../context/catalogContext';
import { useLanguage } from '../../i18n/languageContext';
import { canUseNativeShare, pieceUrl } from '../../lib/contact';
import GalleryView from './Gallery.view';
import { buildFilters, filterPieces, linkedPieceSlug, showPieceInAddressBar } from './Gallery.utils';

export default function Gallery() {
  const { status, categories, pieces, settings } = useCatalog();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [sheet, setSheet] = useState(null); // { mode: 'order' | 'share', piece }
  // A shared link opens its piece once the catalog has loaded.
  const linkedSlug = useRef(linkedPieceSlug());

  const visibleItems = useMemo(() => filterPieces(pieces, activeFilter), [pieces, activeFilter]);

  useEffect(() => {
    if (!linkedSlug.current || pieces.length === 0) return;
    const index = pieces.findIndex((piece) => piece.slug === linkedSlug.current);
    linkedSlug.current = null;
    if (index === -1) return;
    setActiveFilter('all');
    setLightboxIndex(index);
  }, [pieces]);

  useEffect(() => {
    if (linkedSlug.current) return;
    showPieceInAddressBar(lightboxIndex === null ? null : visibleItems[lightboxIndex]);
  }, [lightboxIndex, visibleItems]);

  const openShare = (piece) => {
    if (canUseNativeShare()) {
      navigator
        .share({ title: piece.title, text: t('share.message', { title: piece.title }), url: pieceUrl(piece) })
        .catch(() => {}); // closing the share menu rejects; nothing to do
    } else {
      setSheet({ mode: 'share', piece });
    }
  };

  return (
    <GalleryView
      status={status}
      filters={buildFilters(categories, pieces, t)}
      activeFilter={activeFilter}
      onSelectFilter={setActiveFilter}
      pieces={visibleItems}
      currency={settings.currency}
      onOpenPiece={setLightboxIndex}
      lightboxIndex={lightboxIndex}
      onCloseLightbox={() => setLightboxIndex(null)}
      // The arrows stay within the current filter.
      onNextPiece={() => setLightboxIndex((i) => (i + 1) % visibleItems.length)}
      onPrevPiece={() => setLightboxIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length)}
      onOrder={(piece) => setSheet({ mode: 'order', piece })}
      onShare={openShare}
      sheet={sheet}
      onCloseSheet={() => setSheet(null)}
    />
  );
}
