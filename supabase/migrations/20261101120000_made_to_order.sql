-- Pieces are made to order: the gallery shows designs, and the same design can be ordered
-- any number of times. Orders therefore no longer reserve or sell pieces, and the family
-- can record orders that arrive by chat or phone in the admin panel.
-- Run once in Supabase → SQL Editor, after 20261030120000_init.sql.

-- ─── Orders no longer change pieces ─────────────────────────────────────────

drop trigger orders_sync_pieces on public.orders;
drop trigger orders_release_pieces on public.orders;
drop function public.sync_piece_status();
drop function public.release_order_pieces();

-- ─── What an order holds ────────────────────────────────────────────────────

-- An order taken over the phone may not have an address or a price yet.
alter table public.orders
  alter column city drop not null,
  alter column address drop not null,
  alter column items_total drop not null,
  add column details text check (length(details) <= 2000);

comment on column public.orders.details is 'What to make: colours, size, words to write, anything agreed with the buyer.';
comment on column public.orders.items_total is 'Agreed price in the shop currency; empty until agreed.';

alter table public.order_items
  add column quantity int not null default 1 check (quantity between 1 and 50);

comment on column public.order_items.price is 'Price of one piece when the order was placed.';

-- ─── Orders from the site: no reservation, any published design ─────────────

create or replace function public.place_order(
  piece_ids bigint[],
  customer_name text,
  phone text,
  city text,
  address text,
  email text default null,
  postal_code text default null,
  note text default null,
  payment_method public.payment_method default 'cash_on_delivery'
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  wanted int := (select count(distinct id) from unnest(piece_ids) as id);
  found_count int;
  total int;
  new_order_id bigint;
begin
  if wanted = 0 then
    raise exception 'The order has no pieces' using errcode = '22023';
  end if;

  select count(*), sum(price) into found_count, total
    from public.pieces
   where id = any (piece_ids)
     and status <> 'draft';

  if found_count < wanted then
    -- PT404 makes the API answer with HTTP 404 Not Found.
    raise exception 'One of these designs is not on the site.' using errcode = 'PT404';
  end if;

  insert into public.orders (customer_name, phone, email, city, address, postal_code, note,
                             payment_method, items_total, shipping_fee)
  values (
    trim(place_order.customer_name),
    trim(place_order.phone),
    nullif(trim(place_order.email), ''),
    nullif(trim(place_order.city), ''),
    nullif(trim(place_order.address), ''),
    nullif(trim(place_order.postal_code), ''),
    nullif(trim(place_order.note), ''),
    place_order.payment_method,
    total,
    (select s.shipping_fee from public.settings s where s.id = 1)
  )
  returning id into new_order_id;

  insert into public.order_items (order_id, piece_id, price)
  select new_order_id, p.id, p.price
    from public.pieces p
   where p.id = any (piece_ids);

  return new_order_id;
end;
$$;

-- ─── The family can record and remove orders in the admin panel ─────────────

grant insert, delete on public.orders to authenticated;
grant insert, update, delete on public.order_items to authenticated;

create policy "Admins add orders" on public.orders
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins delete orders" on public.orders
  for delete to authenticated using ((select public.is_admin()));

create policy "Admins manage order items" on public.order_items
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
