import { useLanguage } from '../../i18n/languageContext';
import LanguageSwitch from '../LanguageSwitch';
import './style.css';

/** @param {import('./Navbar.props').NavbarViewProps} props */
export default function NavbarView({
  scrolled,
  menuOpen,
  activeSection,
  sections,
  onToggleMenu,
  onNavigate,
}) {
  const { t } = useLanguage();

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="logo">
          <span className="logo-icon">✧</span>
          Pinecone Art
        </a>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {sections.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeSection === id ? 'active' : ''}
                onClick={onNavigate}
              >
                {t(`nav.${id}`)}
              </a>
            </li>
          ))}
        </ul>
        <LanguageSwitch />
        <button
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label={t('nav.toggle')}
          onClick={onToggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
