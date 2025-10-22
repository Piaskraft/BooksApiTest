const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('GET /api/books', () => {
  it('zwraca 200 i tablicę książek', async () => {
    // przygotowanie: dodajemy jedną książkę, żeby GET nie był pusty
    await request(app).post('/api/books').send({ title: 'Test Book' });

    const res = await request(app).get('/api/books');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.at.least(1);
    // sprawdzamy kształt elementu
    expect(res.body[0]).to.have.keys(['id', 'title']);
  });
});
