// utils/cutText.js
function cutText(text, maxLen) {
  // Walidacja
  if (typeof text !== 'string') return 'Error!';
  if (!Number.isFinite(maxLen) || maxLen <= 0) return 'Error!';

  // Normalizacja białych znaków: trim + pojedyncze spacje
  const normalized = text.replace(/\s+/g, ' ').trim();

  // Jeśli mieści się w limicie — zwróć oryginał (po normalizacji)
  if (normalized.length <= maxLen) return normalized;

  // Rezerwujemy miejsce na "..." (3 znaki)
  const limit = Math.max(0, maxLen - 3);

  const words = normalized.split(' ');
  let out = '';

  for (const w of words) {
    // Długość po ewentualnym dodaniu słowa (z uwzględnieniem spacji)
    const nextLen = out.length === 0 ? w.length : out.length + 1 + w.length;

    if (nextLen <= limit) {
      out = out.length === 0 ? w : `${out} ${w}`;
    } else {
      break;
    }
  }

  // Jeśli żadne słowo nie weszło w limit — zwracamy tylko "..."
  if (out.length === 0) return '...';

  return `${out}...`;
}

module.exports = cutText;
