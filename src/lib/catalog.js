import { getSupabase, isSupabaseConfigured } from './supabase';
import { galleryItems } from '../data/galleryData';

const PHOTO_BUCKET = 'piece-photos';

export const DEFAULT_SETTINGS = {
  currency: 'EUR',
  instagram_url: null,
  facebook_url: null,
  phone: null,
};

const slugify = (title) =>
  title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Shown until Supabase is connected (see README): the pieces from data/galleryData.js.
const SAMPLE_CATALOG = {
  categories: [
    { slug: 'framed', name: 'Framed Art' },
    { slug: 'wreath', name: 'Wreaths & Shapes' },
    { slug: 'standing', name: 'Standing Pieces' },
  ],
  pieces: galleryItems.map((item) => ({
    id: item.id,
    slug: slugify(item.title),
    title: item.title,
    description: item.desc,
    category: item.category,
    price: null,
    status: 'available',
    photos: [{ src: item.src, alt: item.alt }],
  })),
  settings: DEFAULT_SETTINGS,
};

// Photos shipped with the site live under /images; uploaded ones live in Supabase Storage.
function photoUrl(supabase, path) {
  if (/^(\/|https?:\/\/)/.test(path)) return path;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

function toPiece(supabase, row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category.slug,
    price: row.price,
    status: row.status,
    photos: [...row.photos]
      .sort((a, b) => a.position - b.position)
      .map((photo) => ({ src: photoUrl(supabase, photo.path), alt: photo.alt_text || row.title })),
  };
}

export async function fetchCatalog() {
  if (!isSupabaseConfigured) return SAMPLE_CATALOG;

  const supabase = await getSupabase();
  const [categories, pieces, settings] = await Promise.all([
    supabase.from('categories').select('slug, name').order('sort_order'),
    supabase
      .from('pieces')
      .select(
        'id, slug, title, description, price, status, category:categories(slug), photos:piece_photos(path, alt_text, position)'
      )
      .neq('status', 'draft') // a logged-in admin can read drafts, but they don't belong on the site
      .order('sort_order')
      .order('id'),
    supabase.from('settings').select('currency, instagram_url, facebook_url, phone').maybeSingle(),
  ]);
  const failed = [categories, pieces, settings].find((result) => result.error);
  if (failed) throw failed.error;

  return {
    categories: categories.data,
    pieces: pieces.data.map((row) => toPiece(supabase, row)).filter((piece) => piece.photos.length > 0),
    settings: { ...DEFAULT_SETTINGS, ...settings.data },
  };
}

export function priceLabel(piece, currency, t, lang) {
  if (piece.status === 'sold') return t('price.sold');
  if (piece.price == null) return t('price.onRequest');
  try {
    return new Intl.NumberFormat(lang === 'mk' ? 'mk-MK' : 'en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(piece.price);
  } catch {
    return `${piece.price} ${currency}`; // unknown currency code
  }
}
