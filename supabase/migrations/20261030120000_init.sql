-- Pinecone Art database: catalog, orders and enquiries.
-- Run once in Supabase → SQL Editor (or with `supabase db push`), then run supabase/seed.sql.

-- ─── Types ──────────────────────────────────────────────────────────────────

create type public.piece_status as enum ('draft', 'available', 'reserved', 'sold');
create type public.order_status as enum ('new', 'confirmed', 'shipped', 'delivered', 'cancelled');
create type public.payment_method as enum ('cash_on_delivery', 'bank_transfer');
create type public.inquiry_kind as enum ('custom_order', 'question');
create type public.inquiry_status as enum ('new', 'replied', 'accepted', 'declined', 'done');

-- ─── Family members who manage the shop ─────────────────────────────────────
-- After someone has a login (Authentication → Users), make them an admin with:
--   insert into public.admins (user_id, name) values ('<their user id>', 'Mum');

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ─── Catalog ────────────────────────────────────────────────────────────────

create table public.categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table public.pieces (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  description text,
  category_id bigint not null references public.categories (id),
  price int check (price > 0),
  status public.piece_status not null default 'draft',
  width_cm numeric(5, 1),
  height_cm numeric(5, 1),
  depth_cm numeric(5, 1),
  weight_g int,
  materials text[] not null default '{}',
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sold_at timestamptz
);

create index pieces_category_id_idx on public.pieces (category_id);

comment on column public.pieces.price is 'Whole currency units. Leave empty to show "Price on request".';
comment on column public.pieces.status is 'draft = hidden from the site. reserved/sold are set automatically by orders.';
comment on column public.pieces.weight_g is 'Packed weight in grams, for courier pricing.';

create table public.piece_photos (
  id bigint generated always as identity primary key,
  piece_id bigint not null references public.pieces (id) on delete cascade,
  path text not null,
  alt_text text,
  position int not null default 0
);

create index piece_photos_piece_id_idx on public.piece_photos (piece_id, position);

comment on column public.piece_photos.path is 'File name in the piece-photos storage bucket, or /images/... for photos shipped with the site.';
comment on column public.piece_photos.position is '0 = cover photo.';

-- Keeps updated_at and sold_at right, whoever changes the status.
create function public.touch_piece()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.status <> 'sold' then
    new.sold_at := null;
  elsif tg_op = 'INSERT' then
    new.sold_at := coalesce(new.sold_at, now());
  elsif old.status <> 'sold' then
    new.sold_at := now();
  end if;
  return new;
end;
$$;

create trigger pieces_touch
  before insert or update on public.pieces
  for each row execute function public.touch_piece();

-- ─── Shop settings: one row the family can edit ─────────────────────────────

create table public.settings (
  id int primary key default 1 check (id = 1),
  currency text not null default 'EUR' check (currency ~ '^[A-Z]{3}$'),
  shipping_fee int check (shipping_fee >= 0),
  banner_text text,
  instagram_url text,
  facebook_url text,
  phone text,
  email text,
  updated_at timestamptz not null default now()
);

comment on column public.settings.currency is 'ISO code used to show prices, e.g. EUR or MKD.';
comment on column public.settings.shipping_fee is 'Whole currency units added to each order. Leave empty if the courier charges the buyer.';
comment on column public.settings.banner_text is 'Short notice shown on the site, e.g. "Christmas orders close on 15 December".';

insert into public.settings (id) values (1);

create trigger settings_touch
  before update on public.settings
  for each row execute function public.touch_updated_at();

-- ─── Orders ─────────────────────────────────────────────────────────────────

create table public.orders (
  id bigint generated always as identity primary key,
  status public.order_status not null default 'new',
  customer_name text not null check (length(customer_name) between 2 and 120),
  phone text not null check (
    phone ~ '^\+?[0-9 ()/.-]{6,25}$'
    and length(regexp_replace(phone, '[^0-9]', '', 'g')) between 6 and 15
  ),
  email text check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  city text not null check (length(city) between 2 and 80),
  address text not null check (length(address) between 3 and 200),
  postal_code text check (length(postal_code) <= 12),
  note text check (length(note) <= 1000),
  payment_method public.payment_method not null default 'cash_on_delivery',
  items_total int not null,
  shipping_fee int,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_status_idx on public.orders (status, created_at desc);

create table public.order_items (
  order_id bigint not null references public.orders (id) on delete cascade,
  piece_id bigint not null references public.pieces (id),
  price int not null,
  primary key (order_id, piece_id)
);

create index order_items_piece_id_idx on public.order_items (piece_id);

comment on column public.order_items.price is 'Price when the order was placed.';

create trigger orders_touch
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- Reserves the pieces and creates the order in one transaction, so a one-of-a-kind
-- piece can never be sold twice. Called server-side by the order endpoint (after the
-- spam check), never directly from the browser.
create function public.place_order(
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
  reserved int;
  total int;
  new_order_id bigint;
begin
  if wanted = 0 then
    raise exception 'The order has no pieces' using errcode = '22023';
  end if;

  with taken as (
    update public.pieces
       set status = 'reserved'
     where id = any (piece_ids)
       and status = 'available'
       and price is not null
    returning price
  )
  select count(*), coalesce(sum(price), 0) into reserved, total from taken;

  if reserved < wanted then
    -- Raising also rolls back the reservations made above.
    -- PT409 makes the API answer with HTTP 409 Conflict.
    raise exception 'Sorry, this piece has just been sold or is not for sale.' using errcode = 'PT409';
  end if;

  insert into public.orders (customer_name, phone, email, city, address, postal_code, note,
                             payment_method, items_total, shipping_fee)
  values (
    trim(place_order.customer_name),
    trim(place_order.phone),
    nullif(trim(place_order.email), ''),
    trim(place_order.city),
    trim(place_order.address),
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

-- The order's status drives its pieces: confirmed/shipped/delivered → sold,
-- cancelled → available again, back to new → reserved.
create function public.sync_piece_status()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;
  if old.status = 'cancelled' then
    raise exception 'Cancelled orders cannot be reopened. Place a new order instead.';
  end if;

  update public.pieces p
     set status = case new.status
                    when 'cancelled' then 'available'::public.piece_status
                    when 'new' then 'reserved'::public.piece_status
                    else 'sold'::public.piece_status
                  end
    from public.order_items oi
   where oi.order_id = new.id
     and oi.piece_id = p.id;
  return new;
end;
$$;

create trigger orders_sync_pieces
  after update of status on public.orders
  for each row execute function public.sync_piece_status();

-- Deleting an order that was never confirmed frees its pieces.
-- (Deleting a delivered order to clear old addresses leaves the pieces sold.)
create function public.release_order_pieces()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'new' then
    update public.pieces p
       set status = 'available'
      from public.order_items oi
     where oi.order_id = old.id
       and oi.piece_id = p.id;
  end if;
  return old;
end;
$$;

create trigger orders_release_pieces
  before delete on public.orders
  for each row execute function public.release_order_pieces();

-- ─── Custom-order requests and questions ────────────────────────────────────

create table public.inquiries (
  id bigint generated always as identity primary key,
  kind public.inquiry_kind not null default 'question',
  status public.inquiry_status not null default 'new',
  name text not null check (length(name) between 2 and 120),
  contact text not null check (length(contact) between 5 and 120),
  message text not null check (length(message) between 5 and 2000),
  piece_id bigint references public.pieces (id) on delete set null,
  budget text check (length(budget) <= 60),
  deadline date,
  created_at timestamptz not null default now()
);

comment on column public.inquiries.contact is 'Phone number or email address.';
comment on column public.inquiries.piece_id is 'Set when someone asks for a piece like this one.';

-- ─── Who can see and change what ────────────────────────────────────────────
-- The publishable key ships to every browser, so every table has row-level security.
-- Visitors can read the published catalog and the settings. Only admins see drafts,
-- orders and enquiries, and change anything. Orders arrive only through place_order().

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.pieces enable row level security;
alter table public.piece_photos enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries enable row level security;

create policy "Anyone can read categories" on public.categories
  for select using (true);
create policy "Admins manage categories" on public.categories
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read published pieces" on public.pieces
  for select using (status <> 'draft');
create policy "Admins manage pieces" on public.pieces
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read photos of published pieces" on public.piece_photos
  for select using (
    exists (select 1 from public.pieces p
             where p.id = piece_photos.piece_id and p.status <> 'draft')
  );
create policy "Admins manage photos" on public.piece_photos
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Anyone can read settings" on public.settings
  for select using (true);
create policy "Admins update settings" on public.settings
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read orders" on public.orders
  for select to authenticated using ((select public.is_admin()));
create policy "Admins update orders" on public.orders
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read order items" on public.order_items
  for select to authenticated using ((select public.is_admin()));

create policy "Admins read enquiries" on public.inquiries
  for select to authenticated using ((select public.is_admin()));
create policy "Admins update enquiries" on public.inquiries
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Table privileges: start from nothing and grant only what the policies above need.
revoke all on public.admins, public.categories, public.pieces, public.piece_photos,
              public.settings, public.orders, public.order_items, public.inquiries
  from anon, authenticated;

grant select on public.categories, public.pieces, public.piece_photos, public.settings
  to anon, authenticated;
grant insert, update, delete on public.categories, public.pieces, public.piece_photos
  to authenticated;
grant update on public.settings to authenticated;
grant select, update on public.orders, public.inquiries to authenticated;
grant select on public.order_items to authenticated;

revoke execute on function public.place_order from public, anon, authenticated;
grant execute on function public.place_order to service_role;

-- ─── Photo storage ──────────────────────────────────────────────────────────
-- Public bucket: anyone can view photos, only admins can upload, replace or delete them.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('piece-photos', 'piece-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "Admins manage piece photos" on storage.objects
  for all to authenticated
  using (bucket_id = 'piece-photos' and (select public.is_admin()))
  with check (bucket_id = 'piece-photos' and (select public.is_admin()));
