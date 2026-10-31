import { useLanguage } from '../../i18n/languageContext';
import './style.css';

export default function FooterView() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="logo-icon">✧</span>
          <span>Pinecone Art</span>
        </div>
        <p className="footer-text">{t('footer.text', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
