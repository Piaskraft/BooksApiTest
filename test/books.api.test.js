const request = require('supertest');
const { expect } = require('chai');
const app = require('../server'); // eksportujesz app w server.js

describe('POST /api/books', () => {
  it('zwraca 400 gdy brak "title"', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({}); // brak title
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('zwraca 400 gdy "title" za krótki (minlength 2)', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'A' });
    expect(res.status).to.equal(400);
    expect(res.body).to.have.property('error');
  });

  it('zwraca 201 i obiekt książki dla poprawnych danych', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: 'The Hobbit' });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');      // wygenerowane id (np. uuid / licznik)
    expect(res.body).to.have.property('title', 'The Hobbit');
  });
});
