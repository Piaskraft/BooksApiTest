const request = require('supertest');
const { expect } = require('chai');
const app = require('../server'); // eksportujemy app z server.js

describe('API endpoints', () => {
  it('GET /api/status -> 200 i poprawny JSON', async () => {
    const res = await request(app)
      .get('/api/status')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).to.deep.equal({ ok: true, app: 'BooksApi' });
  });

  it('GET /nie-ma-takiej-trasy -> 404 i JSON z komunikatem', async () => {
    const res = await request(app)
      .get('/nie-ma-takiej-trasy')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(res.body).to.have.property('error', 'Not found');
  });

describe('API POST /api/users', () => {
  it('zwraca 400 gdy brak "name" w body', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'john@doe.com' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).to.have.property('error').that.includes('name');
  });

  it('zwraca 400 gdy email jest nieprawidłowy', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'zly-email' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body.error).to.match(/email/i);
  });

  it('zwraca 201 oraz obiekt z id przy poprawnym body', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@doe.com' })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body).to.include({ name: 'John Doe', email: 'john@doe.com' });
    expect(res.body).to.have.property('id').that.is.a('string').and.has.length.greaterThan(0);
  });
});


});
