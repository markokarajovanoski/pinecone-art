import { useLanguage } from '../../i18n/languageContext';
import ContactSheet from '../ContactSheet';
import Lightbox from '../Lightbox';
import PieceCard from '../PieceCard';
import './style.css';

/** @param {import('./Gallery.props').GalleryViewProps} props */
export default function GalleryView({
  status,
  filters,
  activeFilter,
  onSelectFilter,
  pieces,
  currency,
  onOpenPiece,
  lightboxIndex,
  onCloseLightbox,
  onNextPiece,
  onPrevPiece,
  onOrder,
  onShare,
  sheet,
  onCloseSheet,
}) {
  const { t } = useLanguage();

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
            onClick={() => onSelectFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="gallery-message">{t('gallery.loading')}</p>}
      {status === 'error' && <p className="gallery-message">{t('gallery.error')}</p>}

      <div className="gallery-grid">
        {pieces.map((piece, index) => (
          <PieceCard
            key={piece.id}
            piece={piece}
            currency={currency}
            onOpen={() => onOpenPiece(index)}
            onOrder={onOrder}
            onShare={onShare}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          pieces={pieces}
          currentIndex={lightboxIndex}
          currency={currency}
          onClose={onCloseLightbox}
          onNext={onNextPiece}
          onPrev={onPrevPiece}
          onOrder={onOrder}
          onShare={onShare}
          keysEnabled={!sheet}
        />
      )}

      {sheet && <ContactSheet mode={sheet.mode} piece={sheet.piece} onClose={onCloseSheet} />}
    </section>
  );
}
