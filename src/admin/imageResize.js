// Phone photos are 3–10 MB; the site only needs about 1600px. Resizing in the browser
// keeps uploads fast and Storage small (Supabase's own image resizing is a paid feature).
const MAX_SIZE = 1600;

export async function resizeImage(file) {
  const bitmap = await createImageBitmap(file); // also applies the photo's rotation
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const encode = (type) => new Promise((resolve) => canvas.toBlob(resolve, type, 0.82));
  // Some browsers can't write WebP and silently return PNG; use JPEG there instead.
  const webp = await encode('image/webp');
  if (webp && webp.type === 'image/webp') return { blob: webp, extension: 'webp' };
  return { blob: await encode('image/jpeg'), extension: 'jpg' };
}
