import { useLanguage } from '../../i18n/languageContext';
import LanguageSwitchView from './LanguageSwitch.view';
import { LANGUAGE_OPTIONS } from './LanguageSwitch.props';

export default function LanguageSwitch() {
  const { lang, setLang, t } = useLanguage();

  return (
    <LanguageSwitchView
      options={LANGUAGE_OPTIONS}
      activeLang={lang}
      groupLabel={t('lang.label')}
      onSelect={setLang}
    />
  );
}
