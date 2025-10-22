const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('DELETE /api/books/:id', () => {
  it('zwraca 404 gdy książka nie istnieje', async () => {
    const res = await request(app).delete('/api/books/9999');
    expect(res.status).to.equal(404);
    expect(res.body).to.have.property('error');
  });

  it('usuwa książkę i zwraca 204, a GET już jej nie zwraca', async () => {
    // 1) dodajemy książkę
    const create = await request(app).post('/api/books').send({ title: 'To Delete' });
    expect(create.status).to.equal(201);
    const id = create.body.id;

    // 2) usuwamy
    const del = await request(app).delete(`/api/books/${id}`);
    expect(del.status).to.equal(204);

    // 3) sprawdzamy listę – tej książki nie powinno być
    const list = await request(app).get('/api/books');
    const found = list.body.find(b => b.id === id);
    expect(found).to.be.undefined;
  });
});
