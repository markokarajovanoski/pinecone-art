import LanguageProvider from '../i18n/LanguageProvider';
import AdminApp from './AdminApp';
import './admin.css';

export default function AdminRoot() {
  return (
    <LanguageProvider>
      <AdminApp />
    </LanguageProvider>
  );
}
