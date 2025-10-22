// models/test/api/departments/delete.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../../server');          // -> root/server.js
const Department = require('../../../Department');  // -> models/Department.js

chai.use(chaiHttp);
const { expect } = chai;
const request = chai.request;

describe('DELETE /api/departments/:id', () => {
  const id = '5d9f1140f10a81216cfd4408';

  beforeEach(async () => {
    await Department.deleteMany({});
    await Department.create({ _id: id, name: 'To remove' });
  });

  after(async () => {
    await Department.deleteMany({});
  });

  it('powinno usunąć dokument i zwrócić { message: "OK" }', async () => {
    const res = await request(app).delete(`/api/departments/${id}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('OK');

    const inDb = await Department.findById(id);
    expect(inDb).to.be.null;
  });

  it('powinno zwrócić 404 gdy nie istnieje', async () => {
    await Department.deleteMany({});
    const res = await request(app).delete(`/api/departments/${id}`);
    expect(res.status).to.equal(404);
  });
});
