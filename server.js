// server.js
const express = require('express');
const app = express();
const crypto = require('crypto');
const mongoose = require('mongoose');
const Department = require('./models/Department');

// --- middlewares
app.use(express.json());

// --- Mongo by NODE_ENV
const NODE_ENV = process.env.NODE_ENV;
let dbUri = '';

if (NODE_ENV === 'production') {
  dbUri = process.env.MONGODB_URI_PROD || 'mongodb://127.0.0.1:27017/companyDBprod';
} else if (NODE_ENV === 'test') {
  dbUri = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/companyDBtest';
} else {
  dbUri = process.env.MONGODB_URI_DEV || 'mongodb://127.0.0.1:27017/companyDB';
}

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to Mongo:', dbUri))
  .catch(err => console.error('❌ Mongo error:', err));

// --- In-memory dane dla przykładowych endpointów
const USERS = [];
const books = [];
let nextBookId = 1;

// ---------- ROUTES (KOLEJNOŚĆ MA ZNACZENIE) ----------

// Healthcheck
app.get('/api/status', (req, res) => {
  res.status(200).json({ ok: true, app: 'BooksApi' });
});

// Users (demo)
app.post('/api/users', (req, res) => {
  const { name, email } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Field "name" is required.' });
  }
  const emailOk = typeof email === 'string' && /^\S+@\S+\.\S+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ error: 'Invalid email.' });
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  const user = { id, name: name.trim(), email: email.trim() };
  USERS.push(user);
  return res.status(201).json(user);
});

// Books (demo)
app.post('/api/books', (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: '"title" is required' });
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

app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(idx, 1);
  return res.status(204).send();
});

// --- Departments 

// lista
app.get('/api/departments', async (req, res) => {
  try {
    const docs = await Department.find();
    return res.status(200).json(docs);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// losowy – MUSI BYĆ PRZED :id, bo inaczej połknie to :id
app.get('/api/departments/random', async (req, res) => {
  try {
    const [doc] = await Department.aggregate([{ $sample: { size: 1 } }]);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(doc);
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// po ID
app.get('/api/departments/:id', async (req, res) => {
  try {
    const doc = await Department.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(doc);
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// POST
app.post('/api/departments', async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Invalid name' });
    }
    await Department.create({ name: name.trim() });
    return res.status(200).json({ message: 'OK' });
  } catch {
    return res.status(500).json({ error: 'Server error' });
  }
});

// --- Departments: PUT ---
app.put('/api/departments/:id', async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Invalid name' });
    }

    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: { name: name.trim() } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ message: 'OK' });
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});

// --- Departments: DELETE ---
app.delete('/api/departments/:id', async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ message: 'OK' });
  } catch {
    return res.status(400).json({ error: 'Invalid id' });
  }
});




// ---------- 404 
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ---------- Uruchamianie tylko lokalnie; w testach eksportujemy app ----------
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`API listening on :${PORT}`));
}

module.exports = app;
