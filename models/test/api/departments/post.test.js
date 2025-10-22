// models/test/api/departments/post.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../../server');       // do server.js (root)
const Department = require('../../../Department');  // do models/Department.js

chai.use(chaiHttp);
const { expect } = chai;
const request = chai.request;

describe('POST /api/departments', () => {

  // Po teście czyścimy kolekcję (żeby nie zostawały śmieci)
  after(async () => {
    await Department.deleteMany({});
  });

  it('/ powinno dodać dokument i zwrócić { message: "OK" }', async () => {
    const res = await request(server)
      .post('/api/departments')
      .send({ name: '#Department #1' });

    const inDb = await Department.findOne({ name: '#Department #1' });

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.equal('OK');
    expect(inDb).to.not.be.null;
  });

});
