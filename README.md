# Pinecone Art

Website for selling handmade pinecone art. React + Vite front end, Supabase back end
(Postgres database, logins and photo storage).

## Run it locally

Node.js 22 or newer is recommended (the Supabase library requires it; older versions still
build the site but npm prints warnings).

```bash
npm install
npm run dev
```

Until Supabase is connected, the site shows the sample pieces from `src/data/galleryData.js`,
so it works before the database exists.

## Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com). Pick the region closest to
   your buyers.
2. In **SQL Editor**, run `supabase/migrations/20261030120000_init.sql`, then
   `supabase/seed.sql`. This creates the tables, the access rules and the photo bucket, and
   loads the 12 pieces that are on the site today.
3. Copy `.env.example` to `.env.local` and fill in the project URL and the **publishable** key
   from **Project Settings → API Keys**. Restart `npm run dev`.
4. In **Table Editor**:
   - `settings`: set `currency` (an ISO code like `EUR` or `MKD`) and `instagram_url` /
     `facebook_url` with your real profile links.
   - `pieces`: add prices (whole numbers; empty shows "Price on request") and set `status`:
     `draft` hides a piece, `sold` shows the Sold badge.

## What's in the database

| Table | Holds |
| --- | --- |
| `categories` | The gallery's filter buttons |
| `pieces` | Each artwork: title, description, price, status, size, weight |
| `piece_photos` | Photos of each piece; position 0 is the cover |
| `settings` | Currency, shipping fee, contact links, banner text |
| `orders`, `order_items` | Orders and the pieces in them |
| `inquiries` | Custom-order requests and questions |
| `admins` | Family members who can manage the shop |

- Every table has row-level security. Visitors can only read the published catalog and the
  settings; drafts, orders and enquiries are visible to admins only.
- Orders are created only through the `place_order()` database function. It reserves the
  pieces and creates the order in one transaction, so a one-of-a-kind piece can't be sold
  twice.
- An order's status drives its pieces: `confirmed`, `shipped` or `delivered` marks them sold,
  `cancelled` makes them available again.

## Making someone an admin

Create their login in **Authentication → Users**, copy their user id, then run in SQL Editor:

```sql
insert into public.admins (user_id, name) values ('<user id>', 'Mum');
```

## Link previews

Once the site has a domain, set `VITE_SITE_URL` in `.env` (for example
`https://pineconeart.com`) so Facebook, Viber and WhatsApp previews get an absolute image URL.

## Good to know

Free Supabase projects pause after 7 days without any requests. A small scheduled job that
pings the API keeps the project awake; set it up together with hosting.
