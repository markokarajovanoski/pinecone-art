import { useState, useRef, useEffect } from 'react';
import { galleryItems } from '../data/galleryData';
import Lightbox from './Lightbox';

const FILTERS = [
  { label: 'All Pieces', value: 'all' },
  { label: 'Framed Art', value: 'framed' },
  { label: 'Wreaths & Shapes', value: 'wreath' },
  { label: 'Standing Pieces', value: 'standing' },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const cardRefs = useRef([]);

  const visibleItems = galleryItems.filter(
    (item) => activeFilter === 'all' || item.category === activeFilter
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

  const openLightbox = (index) => {
    const globalIndex = galleryItems.findIndex((item) => item.id === visibleItems[index].id);
    setLightboxIndex(globalIndex);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () =>
    setLightboxIndex((i) => (i + 1) % galleryItems.length);

  const prevImage = () =>
    setLightboxIndex((i) => (i - 1 + galleryItems.length) % galleryItems.length);

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
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={`filter-btn${activeFilter === f.value ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {visibleItems.map((item, i) => (
          <div
            key={item.id}
            className="gallery-item reveal"
            ref={(el) => (cardRefs.current[i] = el)}
          >
            <div className="gallery-card">
              <div className="gallery-img-wrapper">
                <img src={item.src} alt={item.alt} loading="lazy" />
                <div className="gallery-overlay">
                  <button className="view-btn" onClick={() => openLightbox(i)}>
                    View
                  </button>
                </div>
              </div>
              <div className="gallery-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryItems}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </section>
  );
}
