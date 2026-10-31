import { useLanguage } from '../../i18n/languageContext';
import LanguageSwitch from '../../components/LanguageSwitch';
import Login from '../Login';
import PieceManager from '../PieceManager';
import SettingsEditor from '../SettingsEditor';

const TABS = ['pieces', 'settings'];

/** @param {import('./AdminApp.props').AdminAppViewProps} props */
export default function AdminAppView({ state, email, tab, onSelectTab, onSignOut }) {
  const { t } = useLanguage();

  return (
    <div className="admin">
      <header className="admin-header">
        <a href="/" className="admin-brand">
          <span className="logo-icon">✧</span> {t('admin.title')}
        </a>
        <LanguageSwitch />
      </header>

      <main className="admin-main">
        {state === 'notConfigured' && <p className="admin-note">{t('admin.notConfigured')}</p>}
        {state === 'loading' && <p className="admin-note">{t('admin.loading')}</p>}
        {state === 'signedOut' && <Login />}
        {state === 'notAdmin' && (
          <div className="admin-card">
            <p>{t('admin.notAdmin')}</p>
            <p className="admin-muted">{email}</p>
            <button type="button" className="admin-btn" onClick={onSignOut}>{t('admin.signOut')}</button>
          </div>
        )}
        {state === 'admin' && (
          <>
            <nav className="admin-tabs">
              {TABS.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`admin-tab${tab === id ? ' active' : ''}`}
                  onClick={() => onSelectTab(id)}
                >
                  {t(`admin.tabs.${id}`)}
                </button>
              ))}
            </nav>
            {tab === 'pieces' ? <PieceManager /> : <SettingsEditor />}
            <footer className="admin-footer">
              <span className="admin-muted">{email}</span>
              <a href="/" className="admin-link">{t('admin.viewSite')}</a>
              <button type="button" className="admin-btn admin-btn-plain" onClick={onSignOut}>
                {t('admin.signOut')}
              </button>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
