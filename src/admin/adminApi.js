// Everything the admin panel reads from or writes to Supabase. Row-level security in the
// database checks that the signed-in user is in the admins table.
import { getSupabase } from '../lib/supabase';
import { photoUrl } from '../lib/catalog';
import { resizeImage } from './imageResize';

const BUCKET = 'piece-photos';

function check({ data, error }) {
  if (error) throw error;
  return data;
}

// Photos shipped with the site (/images/...) aren't in Storage, so only their row is removed.
const isStoragePath = (path) => !path.startsWith('/') && !/^https?:\/\//.test(path);

// ─── Session ────────────────────────────────────────────────────────────────

export async function getSession() {
  const supabase = await getSupabase();
  return check(await supabase.auth.getSession()).session;
}

export async function onSessionChange(callback) {
  const supabase = await getSupabase();
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  const supabase = await getSupabase();
  check(await supabase.auth.signInWithPassword({ email, password }));
}

export async function signOut() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
}

export async function isAdmin() {
  const supabase = await getSupabase();
  return check(await supabase.rpc('is_admin')) === true;
}

// ─── Pieces ─────────────────────────────────────────────────────────────────

export async function fetchPieces() {
  const supabase = await getSupabase();
  const [categories, pieces] = await Promise.all([
    supabase.from('categories').select('id, slug, name').order('sort_order'),
    supabase
      .from('pieces')
      .select(
        'id, slug, title, description, category_id, price, status, width_cm, height_cm, depth_cm, weight_g, sort_order, photos:piece_photos(id, path, alt_text, position)'
      )
      .order('sort_order')
      .order('id'),
  ]);
  return {
    categories: check(categories),
    pieces: check(pieces).map((piece) => ({
      ...piece,
      photos: [...piece.photos]
        .sort((a, b) => a.position - b.position)
        .map((photo) => ({ ...photo, src: photoUrl(supabase, photo.path) })),
    })),
  };
}

export async function setPieceStatus(id, status) {
  const supabase = await getSupabase();
  check(await supabase.from('pieces').update({ status }).eq('id', id));
}

// Creates the piece when it has no id yet; returns the saved row.
export async function savePiece({ id, ...fields }) {
  const supabase = await getSupabase();
  const query = id
    ? supabase.from('pieces').update(fields).eq('id', id)
    : supabase.from('pieces').insert(fields);
  return check(await query.select('id').single());
}

export async function deletePiece(piece) {
  const supabase = await getSupabase();
  const files = piece.photos.map((photo) => photo.path).filter(isStoragePath);
  // Delete the row first: if the piece has orders the database refuses, and no photo is lost.
  check(await supabase.from('pieces').delete().eq('id', piece.id));
  if (files.length) check(await supabase.storage.from(BUCKET).remove(files));
}

// ─── Photos ─────────────────────────────────────────────────────────────────

// Shrinks each photo in the browser, uploads it and adds it after the existing ones.
export async function uploadPhotos(piece, files, onProgress) {
  const supabase = await getSupabase();
  let position = piece.photos.length ? Math.max(...piece.photos.map((p) => p.position)) + 1 : 0;
  for (const [index, file] of files.entries()) {
    onProgress(index, files.length);
    const image = await resizeImage(file);
    const path = `${piece.slug}/${crypto.randomUUID()}.${image.extension}`;
    check(await supabase.storage.from(BUCKET).upload(path, image.blob, { contentType: image.blob.type }));
    check(
      await supabase
        .from('piece_photos')
        .insert({ piece_id: piece.id, path, alt_text: piece.title, position: position++ })
    );
  }
  onProgress(files.length, files.length);
}

export async function deletePhoto(photo) {
  const supabase = await getSupabase();
  check(await supabase.from('piece_photos').delete().eq('id', photo.id));
  if (isStoragePath(photo.path)) check(await supabase.storage.from(BUCKET).remove([photo.path]));
}

// The chosen photo moves to position 0 (the cover); the rest keep their order.
export async function makeCover(piece, photoId) {
  const supabase = await getSupabase();
  const ordered = [
    ...piece.photos.filter((p) => p.id === photoId),
    ...piece.photos.filter((p) => p.id !== photoId),
  ];
  for (const [position, photo] of ordered.entries()) {
    check(await supabase.from('piece_photos').update({ position }).eq('id', photo.id));
  }
}

// ─── Settings ───────────────────────────────────────────────────────────────

export const SETTINGS_FIELDS = [
  'currency',
  'shipping_fee',
  'banner_text',
  'phone',
  'email',
  'instagram_url',
  'facebook_url',
];

export async function fetchSettings() {
  const supabase = await getSupabase();
  return check(await supabase.from('settings').select(SETTINGS_FIELDS.join(', ')).eq('id', 1).single());
}

export async function saveSettings(values) {
  const supabase = await getSupabase();
  check(await supabase.from('settings').update(values).eq('id', 1));
}
