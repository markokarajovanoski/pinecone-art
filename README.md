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
2. In **SQL Editor**, run the files in `supabase/migrations` in date order, then
   `supabase/seed.sql`. This creates the tables, the access rules and the photo bucket, and
   loads the pieces that are on the site today.
3. Copy `.env.example` to `.env.local` and fill in the project URL and the **publishable** key
   from **Project Settings → API Keys**. Restart `npm run dev`.
4. Upload the site's photos from `public/images` to Storage. Copy the **service_role** key
   from the same page (it bypasses every access rule, so never commit it or put it in a
   `VITE_` variable) and run:

   ```powershell
   $env:SUPABASE_SERVICE_ROLE_KEY = '<service_role key>'; npm run upload-photos
   ```

   It's safe to run again. It also lists any photo the database points to that isn't in
   `public/images`.
5. In **Table Editor**:
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

## Photos

All photos are served from the public `piece-photos` Storage bucket, so every computer and
the hosted site see the same ones:

- `site/...`: the original photos, also used by the About section, the custom-order choices
  and the link-preview image. Deleting a piece's photo in the admin panel never removes
  these files.
- `<piece-slug>/...`: photos added in the admin panel (the way to add new photos).

`public/images` is only used when Supabase isn't connected (the sample gallery).

## Hosting

Any static host works: connect the GitHub repository and use

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (same as `.env.local`) |

The admin panel at `/admin` is served by `index.html`: `public/_redirects` handles this on
Netlify and Cloudflare Pages, `vercel.json` on Vercel.

## Keeping Supabase awake

Free Supabase projects pause after 7 days without any requests, and the site then shows no
pieces. `.github/workflows/keep-supabase-awake.yml` reads the catalog every 3 days. It needs
two repository variables (GitHub → **Settings → Secrets and variables → Actions →
Variables**): `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, the same values as `.env.local`.
Run it once by hand from the **Actions** tab to check it works. GitHub turns scheduled jobs
off after 60 days without commits; the Actions tab shows a button to turn it back on.
