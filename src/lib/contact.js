// Links that open a chat, call or share with a message already written.

// International number without "+", e.g. "38970123456". Numbers saved in local form
// ("070 123 456") are assumed to be Macedonian.
function internationalDigits(phone) {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+')) return digits;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0')) return `389${digits.slice(1)}`;
  return digits;
}

function messengerName(facebookUrl) {
  const id = facebookUrl.match(/profile\.php\?id=(\d+)/)?.[1];
  return id ?? facebookUrl.match(/facebook\.com\/([^/?#]+)/)?.[1];
}

export function pieceUrl(piece) {
  return `${window.location.origin}/?piece=${encodeURIComponent(piece.slug)}`;
}

// Ways to message the family, in the order they're shown.
export function orderChannels(settings, message) {
  const channels = [];
  const number = settings.phone ? internationalDigits(settings.phone) : null;
  if (number) {
    channels.push({
      id: 'viber',
      href: `viber://chat?number=%2B${number}&draft=${encodeURIComponent(message)}`,
    });
    channels.push({
      id: 'whatsapp',
      href: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
    });
  }
  const page = settings.facebook_url && messengerName(settings.facebook_url);
  if (page) channels.push({ id: 'messenger', href: `https://m.me/${page}` });
  if (number) channels.push({ id: 'call', href: `tel:+${number}`, phone: settings.phone });
  return channels;
}

// Ways to send a piece to someone else.
export function shareChannels(text, url) {
  const both = `${text}\n${url}`;
  return [
    { id: 'viber', href: `viber://forward?text=${encodeURIComponent(both)}` },
    { id: 'whatsapp', href: `https://wa.me/?text=${encodeURIComponent(both)}` },
    { id: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
  ];
}

// Phones get their own share menu (with every app they have); computers get our buttons.
export function canUseNativeShare() {
  return typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches;
}
