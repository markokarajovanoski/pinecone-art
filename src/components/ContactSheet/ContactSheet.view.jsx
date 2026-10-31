import { useLanguage } from '../../i18n/languageContext';
import './style.css';

// Bottom sheet for ordering a piece (mode "order") or sending it to a friend (mode "share").
/** @param {import('./ContactSheet.props').ContactSheetViewProps} props */
export default function ContactSheetView({
  mode,
  title,
  piece,
  priceText,
  channels,
  copied,
  onCopy,
  onClose,
  onBackdropClick,
}) {
  const { t } = useLanguage();

  return (
    <div className="sheet-backdrop" onClick={onBackdropClick}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <button type="button" className="sheet-close" onClick={onClose} aria-label={t('lightbox.close')}>
          &times;
        </button>
        <div className="sheet-piece">
          <img src={piece.photos[0].src} alt="" />
          <div>
            <h3 id="sheet-title">{title}</h3>
            <p className="sheet-piece-name">{piece.title}</p>
            <p className="sheet-piece-price">{priceText}</p>
          </div>
        </div>

        {mode === 'order' && <p className="sheet-hint">{t('order.hint')}</p>}

        <div className="sheet-buttons">
          {channels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              className={`sheet-btn sheet-btn-${channel.id}`}
              target={channel.external ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {channel.label}
            </a>
          ))}
          {mode === 'share' && (
            <button type="button" className="sheet-btn sheet-btn-copy" onClick={onCopy}>
              {copied ? t('share.copied') : t('share.copy')}
            </button>
          )}
        </div>

        {mode === 'order' && channels.length === 0 && (
          <p className="sheet-hint">
            {t('order.noChannels')}{' '}
            <a href="#contact" onClick={onClose}>{t('nav.contact')}</a>
          </p>
        )}
      </div>
    </div>
  );
}
