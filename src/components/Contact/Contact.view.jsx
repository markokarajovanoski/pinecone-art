import { useCustomOrder } from '../../context/customOrderContext';
import { useLanguage } from '../../i18n/languageContext';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';
import './style.css';

/** @param {import('./Contact.props').ContactViewProps} props */
export default function ContactView({ instagramUrl, instagramHandle, facebookUrl }) {
  const { t } = useLanguage();
  const openCustomOrder = useCustomOrder();

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container reveal">
        <p className="section-subtitle">{t('contact.subtitle')}</p>
        <h2 className="section-title">{t('contact.title')}</h2>
        <p className="contact-description">{t('contact.description')}</p>
        <button type="button" className="contact-custom-btn" onClick={() => openCustomOrder()}>
          {t('custom.cta')}
        </button>
        <div className="social-links">
          <a
            href={instagramUrl}
            className="social-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social-icon instagram-icon">
              <InstagramIcon />
            </div>
            <div className="social-info">
              <span className="social-platform">Instagram</span>
              <span className="social-handle">@{instagramHandle}</span>
              <span className="social-cta">{t('contact.instagramCta')}</span>
            </div>
          </a>

          <a
            href={facebookUrl}
            className="social-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="social-icon facebook-icon">
              <FacebookIcon />
            </div>
            <div className="social-info">
              <span className="social-platform">Facebook</span>
              <span className="social-handle">Pinecone Art</span>
              <span className="social-cta">{t('contact.facebookCta')}</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
