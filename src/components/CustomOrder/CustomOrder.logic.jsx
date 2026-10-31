import { useEffect, useState } from 'react';
import { useCatalog } from '../../context/catalogContext';
import { useLanguage } from '../../i18n/languageContext';
import { priceLabel } from '../../lib/catalog';
import { orderChannels } from '../../lib/contact';
import CustomOrderView from './CustomOrder.view';
import { MAX_COLORS, PALETTES, STEP_COUNT } from './CustomOrder.props';
import { buildMessage, buildSummary, typeForPiece } from './CustomOrder.utils';

/**
 * Step-by-step "order your own piece": type → colours → size → extras → send by chat.
 * @param {{ fromPiece: import('../../lib/catalog').Piece | null, onClose: () => void }} props
 */
export default function CustomOrder({ fromPiece, onClose }) {
  const { settings } = useCatalog();
  const { lang, t } = useLanguage();
  const startType = fromPiece ? typeForPiece(fromPiece) : null;
  const [step, setStep] = useState(startType ? 1 : 0);
  const [pickingColors, setPickingColors] = useState(false);
  const [choices, setChoices] = useState({
    type: startType,
    palette: null,
    colors: [],
    size: null,
    occasion: 'none',
    message: '',
    deadline: '',
    note: '',
    name: '',
  });

  // Escape closes; keys stay out of the lightbox underneath. The page behind doesn't scroll.
  useEffect(() => {
    const onKey = (e) => {
      if (!['Escape', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      e.stopImmediatePropagation();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const setField = (field, value) => setChoices((current) => ({ ...current, [field]: value }));
  const nextStep = () => setStep((current) => Math.min(current + 1, STEP_COUNT - 1));

  // A theme moves on at once; "pick your own" opens the colour grid first.
  const pickPalette = (id) => {
    setField('palette', id);
    if (id === 'custom') setPickingColors(true);
    else nextStep();
  };

  const toggleColor = (id) =>
    setChoices((current) => {
      const picked = current.colors.includes(id)
        ? current.colors.filter((c) => c !== id)
        : current.colors.length < MAX_COLORS
          ? [...current.colors, id]
          : current.colors;
      return { ...current, colors: picked };
    });

  const palettes = fromPiece
    ? [{ id: 'same', colors: [], photo: fromPiece.photos[0]?.src }, ...PALETTES]
    : PALETTES;

  const summary = buildSummary(choices, fromPiece, t);
  const isLastStep = step === STEP_COUNT - 1;
  const channels = isLastStep
    ? orderChannels(settings, buildMessage(summary, fromPiece, t)).map((channel) => ({
        id: channel.id,
        href: channel.href,
        label:
          channel.id === 'call'
            ? t('channel.call', { phone: channel.phone })
            : t(`channel.order.${channel.id}`),
        external: channel.href.startsWith('http'),
      }))
    : [];

  return (
    <CustomOrderView
      step={step}
      choices={choices}
      fromPiece={fromPiece}
      palettes={palettes}
      pickingColors={pickingColors}
      onPickPalette={pickPalette}
      onToggleColor={toggleColor}
      sizePrice={(size) =>
        t('custom.from', { price: priceLabel({ price: size.from, status: 'available' }, 'MKD', t, lang) })
      }
      summary={summary}
      channels={channels}
      onChoose={(field, value) => {
        setField(field, value);
        nextStep();
      }}
      onFieldChange={setField}
      onNext={() => {
        setPickingColors(false);
        nextStep();
      }}
      onBack={() => {
        if (pickingColors) setPickingColors(false); // back from the colour grid to the themes
        else setStep((current) => Math.max(current - 1, 0));
      }}
      onClose={onClose}
      onBackdropClick={(e) => e.target === e.currentTarget && onClose()}
    />
  );
}
