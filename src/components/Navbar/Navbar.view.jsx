import { useLanguage } from '../../i18n/languageContext';
import LanguageSwitch from '../LanguageSwitch';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';
import './style.css';

/** @param {import('./Navbar.props').NavbarViewProps} props */
export default function NavbarView({
  scrolled,
  menuOpen,
  activeSection,
  sections,
  instagramUrl,
  facebookUrl,
  onToggleMenu,
  onNavigate,
}) {
  const { t } = useLanguage();

  const socialLinks = (
    <>
      <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
        <InstagramIcon size={20} />
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
        <FacebookIcon size={20} />
      </a>
    </>
  );

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
          {/* On phones the bar is full, so the social links sit at the bottom of the menu */}
          <li className="nav-menu-social">{socialLinks}</li>
        </ul>
        <div className="nav-social">{socialLinks}</div>
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
