import { useEffect, useState } from 'react';
import { useCatalog } from '../../context/catalogContext';
import { useLanguage } from '../../i18n/languageContext';
import { priceLabel } from '../../lib/catalog';
import { orderChannels, pieceUrl, shareChannels } from '../../lib/contact';
import ContactSheetView from './ContactSheet.view';

/** @param {import('./ContactSheet.props').ContactSheetProps} props */
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
  const priceText = priceLabel(piece, settings.currency, t, lang);
  const isSold = piece.status === 'sold';

  let title;
  let channels;
  if (mode === 'order') {
    const price = piece.price != null && !isSold ? ` (${priceText})` : '';
    const messageKey = isSold ? 'order.messageSimilar' : 'order.message';
    const message = `${t(messageKey, { title: piece.title, price })}\n${url}`;
    title = t(isSold ? 'order.titleSimilar' : 'order.title');
    channels = orderChannels(settings, message);
  } else {
    title = t('share.title');
    channels = shareChannels(t('share.message', { title: piece.title }), url);
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(t('share.copyPrompt'), url);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <ContactSheetView
      mode={mode}
      title={title}
      piece={piece}
      priceText={priceText}
      channels={channels.map((channel) => ({
        id: channel.id,
        href: channel.href,
        label:
          channel.id === 'call'
            ? t('channel.call', { phone: channel.phone })
            : t(`channel.${mode}.${channel.id}`),
        external: channel.href.startsWith('http'),
      }))}
      copied={copied}
      onCopy={copyLink}
      onClose={onClose}
      onBackdropClick={handleBackdropClick}
    />
  );
}
