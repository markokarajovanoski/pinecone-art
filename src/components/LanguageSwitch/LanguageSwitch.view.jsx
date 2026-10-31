import { MkFlag, UkFlag } from './Flags.view';
import './style.css';

const FLAGS = { en: UkFlag, mk: MkFlag };

/** @param {import('./LanguageSwitch.props').LanguageSwitchViewProps} props */
export default function LanguageSwitchView({ options, activeLang, groupLabel, onSelect }) {
  return (
    <div className="lang-switch" role="group" aria-label={groupLabel}>
      {options.map(({ code, label }) => {
        const Flag = FLAGS[code];
        return (
          <button
            key={code}
            type="button"
            className={`lang-btn${activeLang === code ? ' active' : ''}`}
            onClick={() => onSelect(code)}
            aria-pressed={activeLang === code}
            aria-label={label}
            title={label}
            lang={code}
          >
            <Flag />
          </button>
        );
      })}
    </div>
  );
}
