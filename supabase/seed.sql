-- Starting data: the pieces whose photos ship with the site. Run after the migration.
-- Safe to run again: pieces that already exist are skipped, so re-running it only adds
-- new entries. New pieces start as 'available' with no price ("Price on request");
-- set prices and statuses in the admin panel.

insert into public.categories (slug, name, sort_order) values
  ('framed', 'Framed Art', 1),
  ('wreath', 'Wreaths & Shapes', 2),
  ('standing', 'Standing Pieces', 3)
on conflict (slug) do nothing;

with data (sort_order, slug, title, description, category, photo, alt) as (
  values
    (1, 'cherry-blossom-bouquet', 'Cherry Blossom Bouquet',
        'Pink & white pinecone flowers on textured canvas with burlap bow', 'framed',
        '/images/9a7c7ba2-d0a3-4d14-8e37-0f348e18a804.jpg', 'Pink cherry blossom pinecone bouquet on white canvas'),
    (2, 'jewel-garden', 'Jewel Garden',
        'Rich teal, gold & burgundy pinecone blooms on burlap backing', 'framed',
        '/images/3f3e9e01-5da5-4831-82cb-fb66bc2fde16.jpg', 'Jewel-toned pinecone flowers on burlap in wooden frame'),
    (3, 'flora-woman', 'Flora Woman',
        'Hand-drawn silhouette with cascading pinecone flower hair', 'framed',
        '/images/6e25c97e-4c3b-4e73-a4eb-cc756b8f8be5.jpg', 'Woman silhouette with pinecone flower hair on black canvas'),
    (4, 'silver-moonlight', 'Silver Moonlight',
        'Silver, teal & purple pinecone bouquet with burlap ribbon', 'framed',
        '/images/6a3289f9-9c46-4f26-8202-f177b7118d86.jpg', 'Silver and teal pinecone bouquet on grey background'),
    (5, 'rainbow-wreath', 'Rainbow Wreath',
        'Vibrant multicolored pinecone wreath with jute hanger', 'wreath',
        '/images/35b5e998-89de-49dc-b5fa-99f6db6087a2.jpg', 'Colorful rainbow pinecone flower wreath'),
    (6, 'woodland-elegance', 'Woodland Elegance',
        'Teal & lavender blooms with natural birch bark vase', 'framed',
        '/images/55fb9251-52ae-46b3-a589-51a5fa66d3c1.jpg', 'Teal and lavender pinecone bouquet with bark vase'),
    (7, 'golden-blue-tower', 'Golden Blue Tower',
        'Blue & gold pinecone flowers on gilded reclaimed wood', 'standing',
        '/images/55c63e88-56b0-4707-9818-39cee1322435.jpg', 'Blue and gold pinecone flowers on golden wood plank'),
    (8, 'heart-of-pine', 'Heart of Pine',
        'Heart-shaped arrangement of pink & white pinecone flowers', 'wreath',
        '/images/c5834be9-52f5-488d-a119-52988bcf3511.jpg', 'Pink pinecone heart decoration'),
    (9, 'rustic-bouquet', 'Rustic Bouquet',
        'Teal & golden pinecone flowers with natural twig stems and burlap wrap', 'framed',
        '/images/90ba910a-f231-4dce-8ef7-879359cd585a.jpg', 'Teal and yellow pinecone bouquet with twig stems'),
    (10, 'coral-poppy-garden', 'Coral Poppy Garden',
        'Coral & slate pinecone poppies in a natural bark vase with jute bow', 'framed',
        '/images/91233afc-f51a-495b-9b35-994c5f010a01.jpg', 'Coral and grey pinecone flowers with bark vase on burlap'),
    (11, 'mauve-bouquet-tower', 'Mauve Bouquet Tower',
        'Dusky mauve & pink blooms on dark wood with burlap & twine wrap', 'standing',
        '/images/62c6659a-dfbd-4e47-aeae-2eb8861cd28f.jpg', 'Mauve and pink pinecone bouquet on dark wood plank'),
    (12, 'rose-and-slate-tower', 'Rose & Slate Tower',
        'Soft rose & slate-blue pinecone flowers cascading on dark reclaimed wood', 'standing',
        '/images/ed4b326e-91a6-4ca6-96be-02f043e503b4.jpg', 'Pink and teal pinecone flowers on dark wood plank'),
    (13, 'autumn-flame', 'Autumn Flame',
        'Orange, yellow & white pinecone flowers on black burlap with bark and a twisted ribbon', 'framed',
        '/images/autumn-flame.jpg', 'Orange, yellow and white pinecone flowers on black burlap in a black frame'),
    (14, 'old-enough-to-know-better', 'Old Enough to Know Better',
        'Blue, purple & black pinecone flowers with twig stems, a burlap bow and a handwritten quote', 'framed',
        '/images/old-enough-to-know-better.jpg', 'Blue, purple and black pinecone flowers with twig stems on a purple background')
),
new_pieces as (
  insert into public.pieces (slug, title, description, category_id, status, sort_order)
  select d.slug, d.title, d.description, c.id, 'available', d.sort_order
    from data d
    join public.categories c on c.slug = d.category
  on conflict (slug) do nothing
  returning id, slug
)
insert into public.piece_photos (piece_id, path, alt_text, position)
select p.id, d.photo, d.alt, 0
  from new_pieces p
  join data d on d.slug = p.slug;
