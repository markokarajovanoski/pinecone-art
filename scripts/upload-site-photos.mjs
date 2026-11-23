// One-time move of the photos that used to ship in public/images into Supabase Storage,
// so they load from any computer and from the hosted site. Safe to run again.
//
//   1. Copy the service_role key from Supabase → Project Settings → API Keys.
//      It bypasses every access rule: never put it in a VITE_ variable or commit it.
//   2. PowerShell:  $env:SUPABASE_SERVICE_ROLE_KEY = '<key>'; npm run upload-photos
//      Bash:        SUPABASE_SERVICE_ROLE_KEY='<key>' npm run upload-photos
//
// Each file in the folder (default public/images) is uploaded to piece-photos/site/<file>,
// and piece_photos rows that point at /images/<file> are switched to site/<file>.
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'piece-photos';
const FOLDER = 'site';
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Needs VITE_SUPABASE_URL (from .env.local) and SUPABASE_SERVICE_ROLE_KEY. See the top of this file.');
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });
const dir = process.argv[2] ?? 'public/images';
const files = (await readdir(dir)).filter((file) => TYPES[extname(file).toLowerCase()]);

let failed = 0;
for (const file of files) {
  const path = `${FOLDER}/${file}`;
  const body = await readFile(join(dir, file));
  const upload = await supabase.storage
    .from(BUCKET)
    .upload(path, body, { contentType: TYPES[extname(file).toLowerCase()], upsert: true });
  if (upload.error) {
    failed++;
    console.error(`✗ ${file}: ${upload.error.message}`);
    continue;
  }
  const rows = await supabase.from('piece_photos').update({ path }).eq('path', `/images/${file}`).select('id');
  if (rows.error) {
    failed++;
    console.error(`✗ ${file}: uploaded, but updating the database failed: ${rows.error.message}`);
    continue;
  }
  console.log(`✓ ${file} → ${path} (${rows.data.length} photo row${rows.data.length === 1 ? '' : 's'} updated)`);
}

// Rows still pointing at /images/ have no file here, e.g. a photo added on another computer.
const left = await supabase.from('piece_photos').select('path').like('path', '/images/%');
if (left.error) throw left.error;
if (left.data.length) {
  console.warn(`\n${left.data.length} photo row(s) still point at files that weren't found in ${dir}:`);
  for (const { path } of left.data) console.warn(`  ${path}`);
  console.warn('Copy those files into the folder and run this again, or re-upload them in the admin panel.');
}

console.log(`\nDone: ${files.length - failed} of ${files.length} file(s) in Storage.`);
process.exit(failed ? 1 : 0);
