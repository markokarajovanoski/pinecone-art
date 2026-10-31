// Instagram and Facebook links come from the settings row; until they're filled in,
// they point at the sites themselves.
const INSTAGRAM_HOME = 'https://www.instagram.com/';
const FACEBOOK_HOME = 'https://www.facebook.com/';
const DEFAULT_INSTAGRAM_HANDLE = 'pinecone.art';

export function socialLinks(settings) {
  const instagramUrl = settings.instagram_url || INSTAGRAM_HOME;
  return {
    instagramUrl,
    instagramHandle:
      instagramUrl.match(/instagram\.com\/([^/?#]+)/)?.[1] ?? DEFAULT_INSTAGRAM_HANDLE,
    facebookUrl: settings.facebook_url || FACEBOOK_HOME,
  };
}
