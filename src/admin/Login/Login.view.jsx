import { useLanguage } from '../../i18n/languageContext';

/** @param {import('./Login.props').LoginViewProps} props */
export default function LoginView({
  email,
  password,
  busy,
  failed,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  const { t } = useLanguage();

  return (
    <form className="admin-card admin-form" onSubmit={onSubmit}>
      <h1 className="admin-heading">{t('admin.login.title')}</h1>
      <label className="admin-field">
        <span>{t('admin.login.email')}</span>
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </label>
      <label className="admin-field">
        <span>{t('admin.login.password')}</span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </label>
      {failed && <p className="admin-error">{t('admin.login.error')}</p>}
      <button type="submit" className="admin-btn admin-btn-primary" disabled={busy}>
        {busy ? t('admin.login.busy') : t('admin.login.submit')}
      </button>
    </form>
  );
}
