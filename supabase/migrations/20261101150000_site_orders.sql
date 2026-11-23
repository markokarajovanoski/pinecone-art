-- Orders from the site's order form go straight into the orders table.
-- Pieces are made to order, so a fake order can't block anyone; the worst case is an
-- order the family deletes. Simple guards keep that rare: validation, a hidden field
-- that only bots fill in, and limits per phone number and per hour.
-- Run in Supabase → SQL Editor, after 20261101120000_made_to_order.sql. Safe to run
-- again: it replaces any earlier version of the function (orders are kept).

drop function if exists public.submit_order;

create function public.submit_order(
  customer_name text,
  phone text,
  city text,
  address text, -- may be empty
  piece_id bigint default null,
  quantity int default 1,
  details text default null,
  note text default null,
  website text default null -- hidden in the form; people leave it empty, bots fill it in
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  -- Last 8 digits: the same number whether written 070 123 456 or +389 70 123 456.
  number_key text := right(regexp_replace(coalesce(submit_order.phone, ''), '\D', '', 'g'), 8);
  design_price int;
  new_order_id bigint;
begin
  -- A bot filled in the hidden field: pretend it worked, save nothing.
  if nullif(trim(submit_order.website), '') is not null then
    return 0;
  end if;

  -- The address may be left out: the family asks for it when they call to confirm.
  if length(trim(coalesce(submit_order.city, ''))) < 2 then
    raise exception 'The city is needed for delivery.' using errcode = '22023';
  end if;
  if length(trim(submit_order.address)) between 1 and 2 then
    raise exception 'The address is too short.' using errcode = '22023';
  end if;
  if submit_order.piece_id is null and nullif(trim(submit_order.details), '') is null then
    raise exception 'The order needs a design or a description.' using errcode = '22023';
  end if;
  if submit_order.quantity is null or submit_order.quantity not between 1 and 20 then
    raise exception 'Quantity must be between 1 and 20.' using errcode = '22023';
  end if;

  -- Limits: 3 orders per phone number per hour, 30 orders per hour in total.
  -- PT429 makes the API answer with HTTP 429 Too Many Requests.
  if (select count(*) from public.orders o
       where o.created_at > now() - interval '1 hour'
         and right(regexp_replace(o.phone, '\D', '', 'g'), 8) = number_key) >= 3
     or (select count(*) from public.orders o where o.created_at > now() - interval '1 hour') >= 30 then
    raise exception 'Too many orders right now. Please try again later or call us.' using errcode = 'PT429';
  end if;

  if submit_order.piece_id is not null then
    select p.price into design_price
      from public.pieces p
     where p.id = submit_order.piece_id and p.status <> 'draft';
    if not found then
      raise exception 'This design is not on the site.' using errcode = 'PT404';
    end if;
  end if;

  insert into public.orders (customer_name, phone, city, address, details, note, items_total, shipping_fee)
  values (
    trim(submit_order.customer_name),
    trim(submit_order.phone),
    trim(submit_order.city),
    nullif(trim(submit_order.address), ''),
    nullif(trim(submit_order.details), ''),
    nullif(trim(submit_order.note), ''),
    design_price * submit_order.quantity, -- empty when there's no design or no price yet
    (select s.shipping_fee from public.settings s where s.id = 1)
  )
  returning id into new_order_id;

  if submit_order.piece_id is not null then
    insert into public.order_items (order_id, piece_id, price, quantity)
    values (new_order_id, submit_order.piece_id, coalesce(design_price, 0), submit_order.quantity);
  end if;

  return new_order_id;
end;
$$;

-- Visitors call this one function; they still can't read or change orders.
revoke execute on function public.submit_order from public;
grant execute on function public.submit_order to anon, authenticated, service_role;
