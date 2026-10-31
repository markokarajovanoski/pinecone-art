// "All" plus every category that has something to show. Known categories are
// translated; new ones from the database show their own name.
export function buildFilters(categories, pieces, t) {
  return [
    { label: t('gallery.all'), value: 'all' },
    ...categories
      .filter((category) => pieces.some((piece) => piece.category === category.slug))
      .map((category) => {
        const key = `category.${category.slug}`;
        const label = t(key);
        return { label: label === key ? category.name : label, value: category.slug };
      }),
  ];
}

export function filterPieces(pieces, filter) {
  return pieces.filter((piece) => filter === 'all' || piece.category === filter);
}

// The piece a shared link points at (?piece=slug), if the page was opened from one.
export function linkedPieceSlug() {
  return new URLSearchParams(window.location.search).get('piece');
}

// Keeps the address bar pointing at the open piece, so it can be copied and shared.
export function showPieceInAddressBar(piece) {
  const url = new URL(window.location.href);
  if (piece) url.searchParams.set('piece', piece.slug);
  else url.searchParams.delete('piece');
  window.history.replaceState(null, '', url);
}
