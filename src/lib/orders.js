import { getSupabase, isSupabaseConfigured } from './supabase';

// Sends an order from the site's order form. The database checks it and applies the
// spam limits (see supabase/migrations/20261101150000_site_orders.sql).
export async function submitOrder({ name, phone, city, address, pieceId, quantity, details, note, website }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not connected');
  const supabase = await getSupabase();
  const { error } = await supabase.rpc('submit_order', {
    customer_name: name,
    phone,
    city,
    address,
    piece_id: pieceId ?? null,
    quantity,
    details: details ?? null,
    note: note || null,
    website: website || null,
  });
  if (error) throw error;
}
