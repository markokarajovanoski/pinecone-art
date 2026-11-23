// Instagram and Facebook links come from the settings row. Until Instagram is filled in it
// points at instagram.com; Facebook links are hidden until settings.facebook_url is set.
const INSTAGRAM_HOME = 'https://www.instagram.com/';
const DEFAULT_INSTAGRAM_HANDLE = 'pinecone.art';

export function socialLinks(settings) {
  const instagramUrl = settings.instagram_url || INSTAGRAM_HOME;
  return {
    instagramUrl,
    instagramHandle:
      instagramUrl.match(/instagram\.com\/([^/?#]+)/)?.[1] ?? DEFAULT_INSTAGRAM_HANDLE,
    facebookUrl: settings.facebook_url || null,
  };
}
