// utils/formatFullname.js
function formatFullname(fullName) {
  if (typeof fullName !== 'string') return 'Error!';

  // Trymuj i zredukuj wielokrotne spacje do jednej
  const normalized = fullName.replace(/\s+/g, ' ').trim();
  if (!normalized) return 'Error!';

  // Muszą być dokładnie dwa słowa (imię i nazwisko)
  const parts = normalized.split(' ');
  if (parts.length !== 2) return 'Error!';

  // Kapitalizacja pojedyńczego fragmentu (np. "anna" -> "Anna")
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  // Kapitalizacja słowa z obsługą łącznika i apostrofu:
  // "kowalska-nowak" -> "Kowalska-Nowak"
  // "o'neill"        -> "O'Neill"
  const capCompound = (word) =>
    word
      .split(/([-'])/)                        // rozbij na części, ZACHOWAJ "-" i "'"
      .map((token, i) => (i % 2 === 0 ? cap(token) : token)) // kapitalizuj tylko „nie-separator”
      .join('');

  const first = capCompound(parts[0]);
  const last  = capCompound(parts[1]);

  return `${first} ${last}`;
}

module.exports = formatFullname;
