import { useState, useMemo, useEffect, useRef } from 'react';
import { useCatalog } from '../context/catalogContext';
import { priceLabel } from '../lib/catalog';
import { canUseNativeShare, pieceUrl } from '../lib/contact';
import { useLanguage } from '../i18n/languageContext';
import Lightbox from './Lightbox';
import ContactSheet from './ContactSheet';

const BADGE_STATUSES = ['reserved', 'sold'];
const ORDER_LABELS = { available: 'order.button', reserved: 'order.askButton', sold: 'gallery.askSimilar' };

export default function Gallery() {
  const { status, categories, pieces, settings } = useCatalog();
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [sheet, setSheet] = useState(null); // { mode: 'order' | 'share', piece }
  // A shared link (?piece=slug) opens that piece once the catalog has loaded.
  const linkedSlug = useRef(new URLSearchParams(window.location.search).get('piece'));

  // Only offer categories that have something to show.
  const filters = [
    { label: t('gallery.all'), value: 'all' },
    ...categories
      .filter((category) => pieces.some((piece) => piece.category === category.slug))
      // Known categories are translated; new ones from the database show their own name.
      .map((category) => {
        const key = `category.${category.slug}`;
        const label = t(key);
        return { label: label === key ? category.name : label, value: category.slug };
      }),
  ];

  const visibleItems = useMemo(
    () => pieces.filter((piece) => activeFilter === 'all' || piece.category === activeFilter),
    [pieces, activeFilter]
  );

  useEffect(() => {
    if (!linkedSlug.current || pieces.length === 0) return;
    const index = pieces.findIndex((piece) => piece.slug === linkedSlug.current);
    linkedSlug.current = null;
    if (index === -1) return;
    setActiveFilter('all');
    setLightboxIndex(index);
  }, [pieces]);

  // Keep the address bar pointing at the open piece, so it can be copied and shared.
  useEffect(() => {
    if (linkedSlug.current) return;
    const piece = lightboxIndex === null ? null : visibleItems[lightboxIndex];
    const url = new URL(window.location.href);
    if (piece) url.searchParams.set('piece', piece.slug);
    else url.searchParams.delete('piece');
    window.history.replaceState(null, '', url);
  }, [lightboxIndex, visibleItems]);

  const closeLightbox = () => setLightboxIndex(null);

  // The arrows stay within the current filter.
  const nextImage = () =>
    setLightboxIndex((i) => (i + 1) % visibleItems.length);

  const prevImage = () =>
    setLightboxIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length);

  const openOrder = (piece) => setSheet({ mode: 'order', piece });

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
    <section className="gallery-section" id="gallery">
      <div className="section-header reveal">
        <p className="section-subtitle">{t('gallery.subtitle')}</p>
        <h2 className="section-title">{t('gallery.title')}</h2>
        <p className="section-description">{t('gallery.description')}</p>
      </div>

      <div className="filter-bar">
        {filters.map((f) => (
          <button
            key={f.value}
            className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="gallery-message">{t('gallery.loading')}</p>}
      {status === 'error' && <p className="gallery-message">{t('gallery.error')}</p>}

      <div className="gallery-grid">
        {visibleItems.map((piece, i) => (
          <div key={piece.id} className="gallery-item reveal">
            <div className="gallery-card">
              <button
                type="button"
                className="gallery-img-wrapper"
                onClick={() => setLightboxIndex(i)}
                aria-label={t('gallery.viewPiece', { title: piece.title })}
              >
                <img src={piece.photos[0].src} alt={piece.photos[0].alt} loading="lazy" />
                {BADGE_STATUSES.includes(piece.status) && (
                  <span className={`status-badge status-${piece.status}`}>
                    {t(`status.${piece.status}`)}
                  </span>
                )}
                <span className="gallery-overlay" aria-hidden="true">
                  <span className="view-btn">{t('gallery.view')}</span>
                </span>
              </button>
              <div className="gallery-info">
                <h3>{piece.title}</h3>
                <p>{piece.description}</p>
                <p className="gallery-price">{priceLabel(piece, settings.currency, t, lang)}</p>
                <div className="piece-actions">
                  <button type="button" className="order-btn" onClick={() => openOrder(piece)}>
                    {t(ORDER_LABELS[piece.status] ?? 'order.button')}
                  </button>
                  <button type="button" className="share-btn" onClick={() => openShare(piece)}>
                    {t('share.button')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          pieces={visibleItems}
          currentIndex={lightboxIndex}
          currency={settings.currency}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          onOrder={openOrder}
          onShare={openShare}
          orderLabel={(piece) => t(ORDER_LABELS[piece.status] ?? 'order.button')}
          keysEnabled={!sheet}
        />
      )}

      {sheet && <ContactSheet mode={sheet.mode} piece={sheet.piece} onClose={() => setSheet(null)} />}
    </section>
  );
}
