import { useCatalog } from '../../context/catalogContext';
import ContactView from './Contact.view';
import { DEFAULT_INSTAGRAM_HANDLE, FACEBOOK_HOME, INSTAGRAM_HOME } from './Contact.props';

export default function Contact() {
  const { settings } = useCatalog();
  const instagramUrl = settings.instagram_url || INSTAGRAM_HOME;
  const facebookUrl = settings.facebook_url || FACEBOOK_HOME;
  const instagramHandle =
    instagramUrl.match(/instagram\.com\/([^/?#]+)/)?.[1] ?? DEFAULT_INSTAGRAM_HANDLE;

  return (
    <ContactView
      instagramUrl={instagramUrl}
      instagramHandle={instagramHandle}
      facebookUrl={facebookUrl}
    />
  );
}
