const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// False until .env.local is filled in; the site then shows the sample pieces instead.
export const isSupabaseConfigured = Boolean(url && key);

let client;

// Loaded on first use, so the Supabase library isn't part of the first page download.
export function getSupabase() {
  client ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, key));
  return client;
}
