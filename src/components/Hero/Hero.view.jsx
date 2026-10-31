import { useLanguage } from '../../i18n/languageContext';
import './style.css';

export default function HeroView() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <p className="hero-subtitle">{t('hero.subtitle')}</p>
        <h1 className="hero-title">
          {t('hero.title1')}<br />{t('hero.title2')}
        </h1>
        <p className="hero-description">{t('hero.description')}</p>
        <a href="#gallery" className="hero-btn">
          {t('hero.button')}
        </a>
      </div>
      <div className="hero-scroll">
        <span>{t('hero.scroll')}</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}
