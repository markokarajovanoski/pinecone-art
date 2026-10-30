import { useState, useRef, useEffect, useMemo } from 'react';
import { useCatalog } from '../context/catalogContext';
import { priceLabel } from '../lib/catalog';
import Lightbox from './Lightbox';

const STATUS_BADGES = { reserved: 'Reserved', sold: 'Sold' };

export default function Gallery() {
  const { status, categories, pieces, settings } = useCatalog();
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const cardRefs = useRef([]);

  // Only offer categories that have something to show.
  const filters = [
    { label: 'All Pieces', value: 'all' },
    ...categories
      .filter((category) => pieces.some((piece) => piece.category === category.slug))
      .map((category) => ({ label: category.name, value: category.slug })),
  ];

  const visibleItems = useMemo(
    () => pieces.filter((piece) => activeFilter === 'all' || piece.category === activeFilter),
    [pieces, activeFilter]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [visibleItems]);

  const closeLightbox = () => setLightboxIndex(null);

  // The arrows stay within the current filter.
  const nextImage = () =>
    setLightboxIndex((i) => (i + 1) % visibleItems.length);

  const prevImage = () =>
    setLightboxIndex((i) => (i - 1 + visibleItems.length) % visibleItems.length);

  return (
    <section className="gallery-section" id="gallery">
      <div className="section-header reveal">
        <p className="section-subtitle">The Collection</p>
        <h2 className="section-title">Pinecone Masterpieces</h2>
        <p className="section-description">
          Browse through our handcrafted pinecone art pieces — each one a unique expression of
          natural beauty.
        </p>
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

      {status === 'loading' && <p className="gallery-message">Loading the collection…</p>}
      {status === 'error' && (
        <p className="gallery-message">
          The collection couldn&apos;t be loaded right now. Please refresh the page in a moment.
        </p>
      )}

      <div className="gallery-grid">
        {visibleItems.map((piece, i) => (
          <div
            key={piece.id}
            className="gallery-item reveal"
            ref={(el) => (cardRefs.current[i] = el)}
          >
            <div className="gallery-card">
              <button
                type="button"
                className="gallery-img-wrapper"
                onClick={() => setLightboxIndex(i)}
                aria-label={`View ${piece.title}`}
              >
                <img src={piece.photos[0].src} alt={piece.photos[0].alt} loading="lazy" />
                {STATUS_BADGES[piece.status] && (
                  <span className={`status-badge status-${piece.status}`}>
                    {STATUS_BADGES[piece.status]}
                  </span>
                )}
                <span className="gallery-overlay" aria-hidden="true">
                  <span className="view-btn">View</span>
                </span>
              </button>
              <div className="gallery-info">
                <h3>{piece.title}</h3>
                <p>{piece.description}</p>
                <p className="gallery-price">
                  {priceLabel(piece, settings.currency)}
                  {piece.status === 'sold' && (
                    <a href="#contact" className="similar-link">Ask for one like it</a>
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
