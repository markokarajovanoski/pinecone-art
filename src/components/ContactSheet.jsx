import { useEffect, useState } from 'react';
import { useCatalog } from '../context/catalogContext';
import { useLanguage } from '../i18n/languageContext';
import { priceLabel } from '../lib/catalog';
import { orderChannels, pieceUrl, shareChannels } from '../lib/contact';

// Bottom sheet for ordering a piece (mode "order") or sending it to a friend (mode "share").
export default function ContactSheet({ mode, piece, onClose }) {
  const { settings } = useCatalog();
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const url = pieceUrl(piece);
  const price = piece.price != null && piece.status !== 'sold' ? ` (${priceLabel(piece, settings.currency, t, lang)})` : '';
  const messageKey = piece.status === 'sold' ? 'order.messageSimilar' : 'order.message';
  const orderMessage = `${t(messageKey, { title: piece.title, price })}\n${url}`;
  const channels =
    mode === 'order'
      ? orderChannels(settings, orderMessage)
      : shareChannels(t('share.message', { title: piece.title }), url);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(t('share.copyPrompt'), url);
    }
  };

  const title = mode === 'order' ? t(piece.status === 'sold' ? 'order.titleSimilar' : 'order.title') : t('share.title');

  return (
    <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
        <button type="button" className="sheet-close" onClick={onClose} aria-label={t('lightbox.close')}>
          &times;
        </button>
        <div className="sheet-piece">
          <img src={piece.photos[0].src} alt="" />
          <div>
            <h3 id="sheet-title">{title}</h3>
            <p className="sheet-piece-name">{piece.title}</p>
            <p className="sheet-piece-price">{priceLabel(piece, settings.currency, t, lang)}</p>
          </div>
        </div>

        {mode === 'order' && <p className="sheet-hint">{t('order.hint')}</p>}

        <div className="sheet-buttons">
          {channels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              className={`sheet-btn sheet-btn-${channel.id}`}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {channel.id === 'call'
                ? t('channel.call', { phone: channel.phone })
                : t(`channel.${mode}.${channel.id}`)}
            </a>
          ))}
          {mode === 'share' && (
            <button type="button" className="sheet-btn sheet-btn-copy" onClick={copyLink}>
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
