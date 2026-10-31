import { useLanguage } from '../../i18n/languageContext';
import { priceLabel } from '../../lib/catalog';
import PieceActions from '../PieceActions';
import { BADGE_STATUSES } from './PieceCard.props';
import './style.css';

/** @param {import('./PieceCard.props').PieceCardViewProps} props */
export default function PieceCardView({ piece, currency, onOpen, onOrder, onShare }) {
  const { lang, t } = useLanguage();
  const cover = piece.photos[0];

  return (
    <div className="gallery-item reveal">
      <div className="gallery-card">
        <button
          type="button"
          className="gallery-img-wrapper"
          onClick={onOpen}
          aria-label={t('gallery.viewPiece', { title: piece.title })}
        >
          <img src={cover.src} alt={cover.alt} loading="lazy" />
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
          <p className="gallery-price">{priceLabel(piece, currency, t, lang)}</p>
          <PieceActions piece={piece} onOrder={onOrder} onShare={onShare} />
        </div>
      </div>
    </div>
  );
}
