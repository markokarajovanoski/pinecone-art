import { useState, useMemo } from 'react';
import { useCatalog } from '../context/catalogContext';
import { priceLabel } from '../lib/catalog';
import { useLanguage } from '../i18n/languageContext';
import Lightbox from './Lightbox';

const BADGE_STATUSES = ['reserved', 'sold'];

export default function Gallery() {
  const { status, categories, pieces, settings } = useCatalog();
  const { lang, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);

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

  const closeLightbox = () => setLightboxIndex(null);

  // The arrows stay within the current filter.
  const nextImage = () =>
    setLightboxIndex((i) => (i + 1) % visibleItems.length);

  const prevImage = () =>
    setLightboxIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length);

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
                <p className="gallery-price">
                  {priceLabel(piece, settings.currency, t, lang)}
                  {piece.status === 'sold' && (
                    <a href="#contact" className="similar-link">{t('gallery.askSimilar')}</a>
                  )}
                </p>
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
        />
      )}
    </section>
  );
}
