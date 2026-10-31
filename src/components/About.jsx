import { useLanguage } from '../i18n/languageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="about-text reveal">
          <p className="section-subtitle">{t('about.subtitle')}</p>
          <h2 className="section-title">
            {t('about.title1')}<br />{t('about.title2')}
          </h2>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <div className="about-stats">
            {[1, 2, 3].map((n) => (
              <div className="stat" key={n}>
                <span className="stat-number">{t(`about.stat${n}.number`)}</span>
                <span className="stat-label">{t(`about.stat${n}.label`)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="about-visual reveal">
          <div className="about-image-grid">
            <img
              src="/images/3f3e9e01-5da5-4831-82cb-fb66bc2fde16.jpg"
              alt={t('about.img1')}
              className="about-img about-img-1"
            />
            <img
              src="/images/35b5e998-89de-49dc-b5fa-99f6db6087a2.jpg"
              alt={t('about.img2')}
              className="about-img about-img-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
