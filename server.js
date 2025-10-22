// server.js
const express = require('express');
const app = express();
const crypto = require('crypto');

const USERS = [];
app.use(express.json());

// Prosta pamięć na potrzeby testów (bez bazy)
const books = [];
let nextBookId = 1;



// Prosty endpoint do testu
app.get('/api/status', (req, res) => {
  res.status(200).json({ ok: true, app: 'BooksApi' });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body || {};

  // walidacja name
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Field "name" is required.' });
  }



  // walidacja email (prosty regex wystarczy do testów)
  const emailOk = typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ error: 'Invalid email.' });
  }

  // generowanie id (Node 18+ ma crypto.randomUUID)
  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

  const user = { id, name: name.trim(), email: email.trim() };
  USERS.push(user);

  return res.status(201).json(user);
});

app.post('/api/books', (req, res) => {
  const { title } = req.body;

  // walidacje jak w teście modelu
  if (!title) {
    return res.status(400).json({ error: '"title" is required' });
  }
  if (typeof title !== 'string' || title.trim().length < 2) {
    return res.status(400).json({ error: '"title" must be at least 2 chars' });
  }

  const book = { id: String(nextBookId++), title: title.trim() };
  books.push(book);

  return res.status(201).json(book);
});


app.get('/api/books', (req, res) => {
  res.status(200).json(books);
});

// DELETE /api/books/:id
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;

  // znajdź książkę po id
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // usuń z tablicy
  books.splice(index, 1);

  // 204 = No Content (czyli bez body)
  return res.status(204).send();
});





// Fallback 404 (dla nieistniejących ścieżek)
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Uruchamiaj serwer TYLKO gdy plik jest uruchamiany bezpośrednio: `node server.js`
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

// Eksport dla testów (supertest korzysta z app)
module.exports = app;
