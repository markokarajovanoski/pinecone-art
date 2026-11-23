// notify-new-order: emails the shop when a new order is saved.
// Called by the orders_notify_new trigger (see migration 20261123120000_new_order_email.sql)
// with { "order_id": 123 }.
//
// Secrets (Supabase → Edge Functions → Secrets), set by the owner, never in code:
//   GMAIL_USER          the Gmail address that sends the email (pineconeartvk@gmail.com)
//   GMAIL_APP_PASSWORD  a Google app password for that address (not its normal password)
//   NOTIFY_TO           where the email goes; defaults to GMAIL_USER
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
//
// Deployed without login checks (--no-verify-jwt) because the database calls it. That is
// safe: it only ever emails the shop about a real order, and each order at most once
// (orders.admin_notified_at), so calling it by hand can't spam anyone.

import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import nodemailer from 'npm:nodemailer@6.9.16';

const ADMIN_URL = 'https://pinecone-art.pages.dev/admin';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  postal_code: string | null;
  details: string | null;
  note: string | null;
  items_total: number | null;
  shipping_fee: number | null;
  payment_method: string;
  order_items: { quantity: number; price: number; pieces: { title: string } | null }[];
};

function buildEmail(order: Order, currency: string) {
  const money = (n: number) => `${n} ${currency}`;
  const items = order.order_items.map(
    (item) => `${item.pieces?.title ?? 'Дизајн'} × ${item.quantity}${item.price ? ` (${money(item.price)} парче)` : ''}`,
  );
  const where = [order.address, order.postal_code, order.city].filter(Boolean).join(', ');
  const lines = [
    `Нова нарачка #${order.id}`,
    '',
    `Име: ${order.customer_name}`,
    `Телефон: ${order.phone}`,
    ...(order.email ? [`Е-пошта: ${order.email}`] : []),
    `Адреса: ${where || 'не е внесена'}`,
    '',
    ...(items.length ? ['Нарачано:', ...items.map((item) => `• ${item}`)] : []),
    ...(order.details ? ['', `Опис: ${order.details}`] : []),
    ...(order.note ? ['', `Белешка: ${order.note}`] : []),
    '',
    `Вкупно: ${order.items_total != null ? money(order.items_total) : 'цената уште не е договорена'}`,
    ...(order.shipping_fee != null ? [`Достава: ${money(order.shipping_fee)}`] : []),
    `Плаќање: ${order.payment_method === 'bank_transfer' ? 'уплата на сметка' : 'при достава'}`,
    '',
    `Отвори ја во админ: ${ADMIN_URL}`,
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#2d2433">${lines
    .map((line) => (line ? `<p style="margin:0 0 4px">${escapeHtml(line)}</p>` : '<br>'))
    .join('')}</div>`;
  return {
    subject: `Нова нарачка #${order.id} – ${order.customer_name}`,
    text: lines.join('\n'),
    html,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Use POST.' }, 405);

  let orderId: number;
  try {
    orderId = Number((await req.json()).order_id);
    if (!Number.isInteger(orderId) || orderId <= 0) throw new Error();
  } catch {
    return json({ error: 'Send { "order_id": 123 }.' }, 400);
  }

  const gmailUser = Deno.env.get('GMAIL_USER');
  const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');
  if (!gmailUser || !gmailPassword) {
    console.error('GMAIL_USER / GMAIL_APP_PASSWORD secrets are missing; order', orderId, 'not emailed.');
    return json({ error: 'Email is not set up yet.' }, 500);
  }
  const to = Deno.env.get('NOTIFY_TO') || gmailUser;

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  // Claim the order: only one call ever gets it, so the email is sent once.
  const claim = await supabase
    .from('orders')
    .update({ admin_notified_at: new Date().toISOString() })
    .eq('id', orderId)
    .is('admin_notified_at', null)
    .select('id, customer_name, phone, email, city, address, postal_code, details, note, items_total, shipping_fee, payment_method, order_items(quantity, price, pieces(title))');
  if (claim.error) {
    console.error('Could not read order', orderId, claim.error.message);
    return json({ error: claim.error.message }, 500);
  }
  const order = (claim.data as unknown as Order[])[0];
  if (!order) return json({ skipped: 'No such order, or it was already emailed.' });

  const settings = await supabase.from('settings').select('currency').eq('id', 1).maybeSingle();
  const email = buildEmail(order, settings.data?.currency ?? 'MKD');

  try {
    // Port 465 (TLS). Supabase blocks outgoing ports 25 and 587.
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPassword },
    });
    await transport.sendMail({
      from: `"Pinecone Art" <${gmailUser}>`,
      to,
      replyTo: order.email ?? undefined,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  } catch (error) {
    // Let a later call try again.
    await supabase.from('orders').update({ admin_notified_at: null }).eq('id', orderId);
    console.error('Sending failed for order', orderId, error instanceof Error ? error.message : error);
    return json({ error: 'The email could not be sent.' }, 502);
  }

  return json({ sent: true, order_id: orderId });
});
