import { useLanguage } from '../i18n/languageContext';

// Inline SVG flags: emoji flags show up as plain letters on Windows.
function UkFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true">
      <clipPath id="uk-flag-clip">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-flag-clip)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

function MkFlag() {
  return (
    <svg viewBox="0 0 20 10" aria-hidden="true">
      <rect width="20" height="10" fill="#D20000" />
      <g fill="#FFE600">
        <polygon points="10,5 8.6,0 11.4,0" />
        <polygon points="10,5 8.6,10 11.4,10" />
        <polygon points="10,5 0,3.9 0,6.1" />
        <polygon points="10,5 20,3.9 20,6.1" />
        <polygon points="10,5 0,0 2.6,0 0,1.3" />
        <polygon points="10,5 20,0 17.4,0 20,1.3" />
        <polygon points="10,5 0,10 2.6,10 0,8.7" />
        <polygon points="10,5 20,10 17.4,10 20,8.7" />
        <circle cx="10" cy="5" r="2" fill="#D20000" />
        <circle cx="10" cy="5" r="1.65" />
      </g>
    </svg>
  );
}

const OPTIONS = [
  { code: 'en', label: 'English', Flag: UkFlag },
  { code: 'mk', label: 'Македонски', Flag: MkFlag },
];

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.label')}>
      {OPTIONS.map(({ code, label, Flag }) => (
        <button
          key={code}
          type="button"
          className={`lang-btn${lang === code ? ' active' : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          aria-label={label}
          title={label}
          lang={code}
        >
          <Flag />
        </button>
      ))}
    </div>
  );
}
