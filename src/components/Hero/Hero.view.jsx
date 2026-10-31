import { useCustomOrder } from '../../context/customOrderContext';
import { useLanguage } from '../../i18n/languageContext';
import './style.css';

export default function HeroView() {
  const { t } = useLanguage();
  const openCustomOrder = useCustomOrder();

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <h1 className="hero-title">
          {t('hero.title1')}<br />{t('hero.title2')}
        </h1>
        <p className="hero-description">{t('hero.description')}</p>
        <div className="hero-buttons">
          <a href="#gallery" className="hero-btn">
            {t('hero.button')}
          </a>
          <button type="button" className="hero-btn hero-btn-outline" onClick={() => openCustomOrder()}>
            {t('custom.cta')}
          </button>
        </div>
      </div>
      <div className="hero-scroll">
        <span>{t('hero.scroll')}</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
