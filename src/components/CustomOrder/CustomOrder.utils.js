import { pieceUrl } from '../../lib/contact';
import { SIZES } from './CustomOrder.props';

// A piece's own category, as the first choice when starting from "I'd like this".
export function typeForPiece(piece) {
  if (piece.slug?.includes('heart')) return 'heart';
  return ['framed', 'wreath', 'standing'].includes(piece.category) ? piece.category : null;
}

const formatDate = (iso) => iso.split('-').reverse().join('.'); // 2026-12-15 → 15.12.2026

// "Есенски бои", or the picked colours by name: "Розова, Златна, Бела".
function colorsText(choices, fromPiece, t) {
  if (!choices.palette) return null;
  if (choices.palette === 'same') return t('custom.palette.same', { title: fromPiece?.title ?? '' });
  if (choices.palette === 'custom') return choices.colors.map((id) => t(`custom.color.${id}`)).join(', ');
  return t(`custom.palette.${choices.palette}`);
}

// The visitor's choices as label/value rows, for the summary and the message.
export function buildSummary(choices, fromPiece, t) {
  const rows = [];
  const add = (label, value) => value && rows.push({ label: t(`custom.summary.${label}`), value });

  add('type', choices.type && t(`custom.type.${choices.type}`));
  add('colors', colorsText(choices, fromPiece, t));
  const size = SIZES.find((s) => s.id === choices.size);
  add('size', size && `${t(`custom.size.${size.id}`)} (${size.cm})`);
  add('occasion', choices.occasion !== 'none' && t(`custom.occasion.${choices.occasion}`));
  add('message', choices.message.trim() && `„${choices.message.trim()}“`);
  add('deadline', choices.deadline && formatDate(choices.deadline));
  add('note', choices.note.trim());
  add('name', choices.name.trim());
  return rows;
}

// The ready-to-send chat message.
export function buildMessage(summary, fromPiece, t) {
  const lines = [t('custom.message.intro')];
  if (fromPiece) lines.push(t('custom.message.likeThis', { title: fromPiece.title }), pieceUrl(fromPiece));
  lines.push(...summary.map(({ label, value }) => `• ${label}: ${value}`));
  return lines.join('\n');
}
