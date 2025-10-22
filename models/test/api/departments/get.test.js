// test/api/departments/get.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../../server');
const Department = require('../../../Department');

chai.use(chaiHttp);
const { expect } = chai;
const request = chai.request;


describe('GET /api/departments', () => {
  // seed dwóch działów z ustawionymi _id, żeby test :id był deterministyczny
  before(async () => {
    await Department.deleteMany({});
    await Department.insertMany([
      { _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' },
      { _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' },
    ]);
  });

  after(async () => {
    await Department.deleteMany({});
  });

  it('/ powinno zwrócić wszystkie działy (tablica 2 el.)', async () => {
    const res = await request(app).get('/api/departments');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(2);
  });

  it('/:id powinno zwrócić jeden dział po ID', async () => {
    const res = await request(app).get('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
    expect(res.body.name).to.exist;
  });

  it('/random powinno zwrócić losowy dział (obiekt)', async () => {
    const res = await request(app).get('/api/departments/random');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });
});
