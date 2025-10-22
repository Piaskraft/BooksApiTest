const mongoose = require('mongoose');
const expect = require('chai').expect;

// tymczasowy model Book (jeśli nie masz go jeszcze w models/)
const BookSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 100 },
  author: { type: String },
});

const Book = mongoose.model('Book', BookSchema);

describe('Book model', () => {
  it('powinien wymagać pola "title"', () => {
    const book = new Book({});
    const err = book.validateSync();
    expect(err.errors.title).to.exist;
  });

 it('powinien odrzucić za krótki title (minlength)', () => {
  const book = new Book({ title: 'A' }); // 1 znak – za krótko
  const err = book.validateSync();
  expect(err.errors.title).to.exist;
});

  it('powinien przejść walidację dla poprawnych danych', () => {
    const book = new Book({ title: 'The Hobbit', author: 'J.R.R. Tolkien' });
    const err = book.validateSync();
    expect(err).to.be.undefined;
  });

  after(() => {
    mongoose.models = {};
  });
});
