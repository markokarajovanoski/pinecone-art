import { useLanguage } from '../../i18n/languageContext';
import { COLORS, MAX_COLORS, OCCASIONS, SIZES, STEP_COUNT, TYPES } from './CustomOrder.props';
import './style.css';

const QUESTIONS = ['type', 'colors', 'size', 'extras', 'send'];

/** @param {import('./CustomOrder.props').CustomOrderViewProps} props */
export default function CustomOrderView({
  step,
  choices,
  fromPiece,
  palettes,
  pickingColors,
  onPickPalette,
  onToggleColor,
  sizePrice,
  summary,
  channels,
  onChoose,
  onFieldChange,
  onNext,
  onBack,
  onClose,
  onBackdropClick,
}) {
  const { t } = useLanguage();
  const field = (name) => ({ value: choices[name], onChange: (e) => onFieldChange(name, e.target.value) });

  return (
    <div className="custom-backdrop" onClick={onBackdropClick}>
      <div className="custom-dialog" role="dialog" aria-modal="true" aria-labelledby="custom-question">
        <header className="custom-header">
          {step > 0 ? (
            <button type="button" className="custom-back" onClick={onBack}>{t('custom.back')}</button>
          ) : (
            <span className="custom-title">{t('custom.title')}</span>
          )}
          <span className="custom-step">{t('custom.step', { n: step + 1, total: STEP_COUNT })}</span>
          <button type="button" className="custom-close" onClick={onClose} aria-label={t('lightbox.close')}>
            &times;
          </button>
        </header>
        <div className="custom-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }} />
        </div>

        <h2 id="custom-question" className="custom-question">{t(`custom.q.${QUESTIONS[step]}`)}</h2>
        {fromPiece && step < 2 && (
          <p className="custom-from">{t('custom.message.likeThis', { title: fromPiece.title })}</p>
        )}

        {step === 0 && (
          <div className="custom-grid">
            {TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                className={`custom-card${choices.type === type.id ? ' selected' : ''}`}
                onClick={() => onChoose('type', type.id)}
              >
                <img src={type.photo} alt="" />
                <span>{t(`custom.type.${type.id}`)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && !pickingColors && (
          <div className="custom-grid">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                type="button"
                className={`custom-card${choices.palette === palette.id ? ' selected' : ''}`}
                onClick={() => onPickPalette(palette.id)}
              >
                {palette.photo && <img src={palette.photo} alt="" />}
                {palette.colors.length > 0 && (
                  <span className="custom-swatch" aria-hidden="true">
                    {palette.colors.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                )}
                {palette.id === 'custom' && (
                  <span className="custom-swatch" aria-hidden="true">
                    <i
                      className="custom-wheel"
                      style={{ background: `conic-gradient(${COLORS.map((c) => c.hex).join(', ')}, ${COLORS[0].hex})` }}
                    />
                  </span>
                )}
                <span>
                  {palette.id === 'same'
                    ? t('custom.palette.same', { title: fromPiece?.title ?? '' })
                    : t(`custom.palette.${palette.id}`)}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && pickingColors && (
          <div className="custom-form">
            <p className="custom-tip">
              {t('custom.pickHint', { max: MAX_COLORS })} ({choices.colors.length}/{MAX_COLORS})
            </p>
            <div className="custom-colors">
              {COLORS.map((color) => {
                const picked = choices.colors.includes(color.id);
                const full = !picked && choices.colors.length >= MAX_COLORS;
                return (
                  <button
                    key={color.id}
                    type="button"
                    className={`custom-color${picked ? ' selected' : ''}`}
                    aria-pressed={picked}
                    disabled={full}
                    onClick={() => onToggleColor(color.id)}
                  >
                    <i style={{ background: color.hex }}>
                      {picked && <b className="custom-check" aria-hidden="true">✓</b>}
                    </i>
                    <span>{t(`custom.color.${color.id}`)}</span>
                  </button>
                );
              })}
            </div>
            <button type="button" className="custom-next" disabled={choices.colors.length === 0} onClick={onNext}>
              {t('custom.next')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="custom-list">
            {SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                className={`custom-option${choices.size === size.id ? ' selected' : ''}`}
                onClick={() => onChoose('size', size.id)}
              >
                <strong>{t(`custom.size.${size.id}`)}</strong>
                <span>{size.cm}</span>
                <span className="custom-price">{sizePrice(size)}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="custom-form">
            <p className="custom-label">{t('custom.extras.occasion')}</p>
            <div className="custom-chips">
              {OCCASIONS.map((occasion) => (
                <button
                  key={occasion}
                  type="button"
                  className={`custom-chip${choices.occasion === occasion ? ' selected' : ''}`}
                  aria-pressed={choices.occasion === occasion}
                  onClick={() => onFieldChange('occasion', occasion)}
                >
                  {t(`custom.occasion.${occasion}`)}
                </button>
              ))}
            </div>
            <label className="custom-field">
              <span>{t('custom.extras.message')}</span>
              <input type="text" maxLength={80} placeholder={t('custom.extras.messageHint')} {...field('message')} />
            </label>
            <label className="custom-field">
              <span>{t('custom.extras.deadline')}</span>
              <input type="date" {...field('deadline')} />
            </label>
            <label className="custom-field">
              <span>{t('custom.extras.note')}</span>
              <textarea rows={2} maxLength={300} {...field('note')} />
            </label>
            <p className="custom-tip">{t('custom.extras.photoTip')}</p>
            <button type="button" className="custom-next" onClick={onNext}>{t('custom.next')}</button>
          </div>
        )}

        {step === 4 && (
          <div className="custom-form">
            <dl className="custom-summary">
              {summary.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <label className="custom-field">
              <span>{t('custom.name')}</span>
              <input type="text" autoComplete="name" maxLength={60} {...field('name')} />
            </label>
            <p className="custom-tip">{t('custom.sendHint')}</p>
            <div className="custom-send">
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
            </div>
            {channels.length === 0 && <p className="custom-tip">{t('order.noChannels')} {t('nav.contact')}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
