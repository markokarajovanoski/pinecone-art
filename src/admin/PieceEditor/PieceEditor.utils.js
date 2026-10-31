// Macedonian Cyrillic → Latin, so titles typed in Macedonian still give readable links.
const CYRILLIC = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', ѓ: 'gj', е: 'e', ж: 'zh', з: 'z', ѕ: 'dz',
  и: 'i', ј: 'j', к: 'k', л: 'l', љ: 'lj', м: 'm', н: 'n', њ: 'nj', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', ќ: 'kj', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', џ: 'dj', ш: 'sh',
};

export function slugify(title) {
  return [...title.toLowerCase()]
    .map((char) => CYRILLIC[char] ?? char)
    .join('')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// The piece's link (?piece=…) — set once when it's created, so shared links keep working.
export function uniqueSlug(title, taken) {
  const base = slugify(title) || 'piece';
  let slug = base;
  for (let n = 2; taken.includes(slug); n++) slug = `${base}-${n}`;
  return slug;
}

const blankOr = (value, convert) => (String(value ?? '').trim() === '' ? null : convert(value));

export function toForm(piece, categories) {
  if (!piece) {
    return {
      title: '', description: '', category_id: String(categories[0]?.id ?? ''), price: '',
      status: 'draft', width_cm: '', height_cm: '', depth_cm: '', weight_g: '',
    };
  }
  const text = (value) => (value == null ? '' : String(value));
  return {
    title: piece.title,
    description: text(piece.description),
    category_id: String(piece.category_id),
    price: text(piece.price),
    status: piece.status,
    width_cm: text(piece.width_cm),
    height_cm: text(piece.height_cm),
    depth_cm: text(piece.depth_cm),
    weight_g: text(piece.weight_g),
  };
}

// Form strings → database values; empty fields become null.
export function toFields(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim() || null,
    category_id: Number(form.category_id),
    price: blankOr(form.price, (v) => Math.round(Number(v))),
    status: form.status,
    width_cm: blankOr(form.width_cm, Number),
    height_cm: blankOr(form.height_cm, Number),
    depth_cm: blankOr(form.depth_cm, Number),
    weight_g: blankOr(form.weight_g, (v) => Math.round(Number(v))),
  };
}
