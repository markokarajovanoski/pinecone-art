-- Email the shop whenever a new order is saved (from the site's form or place_order()).
-- Run once in Supabase → SQL Editor, after 20261101150000_site_orders.sql, and after the
-- notify-new-order Edge Function is deployed (see README → "New order emails").
--
-- How it works: after an order is inserted, pg_net calls the notify-new-order function
-- with the order id. The call goes out once the order's transaction has committed, so the
-- order's items are already saved. The function sends the email and sets admin_notified_at,
-- so each order is emailed at most once.

create extension if not exists pg_net with schema extensions;

alter table public.orders
  add column if not exists admin_notified_at timestamptz;

comment on column public.orders.admin_notified_at is
  'When the shop was emailed about this order (set by the notify-new-order function).';

-- Orders that already exist are not emailed.
update public.orders set admin_notified_at = created_at where admin_notified_at is null;

create or replace function public.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://gjpozmwjpnhtglsqopqb.supabase.co/functions/v1/notify-new-order',
    body := jsonb_build_object('order_id', new.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 10000
  );
  return new;
end;
$$;

revoke execute on function public.notify_new_order from public, anon, authenticated;

drop trigger if exists orders_notify_new on public.orders;
create trigger orders_notify_new
  after insert on public.orders
  for each row execute function public.notify_new_order();
