import { useCatalog } from '../../context/catalogContext';
import { socialLinks } from '../../lib/social';
import ContactView from './Contact.view';

export default function Contact() {
  const { settings } = useCatalog();
  const { instagramUrl, instagramHandle, facebookUrl } = socialLinks(settings);

  return (
    <ContactView
      instagramUrl={instagramUrl}
      instagramHandle={instagramHandle}
      facebookUrl={facebookUrl}
    />
  );
}
