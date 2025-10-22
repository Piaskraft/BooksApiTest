// models/test/api/departments/put.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../../server');       // -> root/server.js
const Department = require('../../../Department'); // -> models/Department.js

chai.use(chaiHttp);
const { expect } = chai;
const request = chai.request;

describe('PUT /api/departments/:id', () => {
  const id = '5d9f1159f81ce8d1ef2bee48';

  beforeEach(async () => {
    await Department.deleteMany({});
    await Department.create({ _id: id, name: 'Old name' });
  });

  after(async () => {
    await Department.deleteMany({});
  });

  it('powinno zaktualizować dokument i zwrócić { message: "OK" }', async () => {
    const res = await request(app)
      .put(`/api/departments/${id}`)
      .send({ name: 'New name' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('OK');

    const inDb = await Department.findById(id);
    expect(inDb).to.not.be.null;
    expect(inDb.name).to.equal('New name');
  });

  it('powinno zwrócić 400 dla niepoprawnej nazwy', async () => {
    const res = await request(app)
      .put(`/api/departments/${id}`)
      .send({ name: ' ' });

    expect(res.status).to.equal(400);
  });
});
