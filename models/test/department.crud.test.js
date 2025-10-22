// models/test/department.crud.test.js
const mongoose = require('mongoose');
const { expect } = require('chai');
const Department = require('../Department');

const URI = process.env.MONGODB_URI_TEST || 'mongodb://127.0.0.1:27017/companyDBtest';

describe('Department CRUD', () => {
  before(async () => {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  // Czyścimy kolekcję przed/po testach
  beforeEach(async () => {
    await Department.deleteMany({});
  });

  afterEach(async () => {
    await Department.deleteMany({});
  });

 describe('READ', () => {
  // seed przed każdym testem READ
  beforeEach(async () => {
    await Department.insertMany([
      { name: 'Management' },
      { name: 'Engineering' },
    ]);
  });

  it('find() zwraca rekordy', async () => {
    const docs = await Department.find();
    expect(docs).to.be.an('array');
    expect(docs.length).to.equal(2);

    const names = docs.map(d => d.name).sort();
    expect(names).to.deep.equal(['Engineering', 'Management']);
  });

  it('findOne() zwraca pojedynczy rekord', async () => {
    const doc = await Department.findOne({ name: 'Engineering' });
    expect(doc).to.be.an('object');
    expect(doc).to.have.property('_id');
    expect(doc.name).to.equal('Engineering');
  });
});


  describe('CREATE', () => {
  it('save() tworzy nowy dokument', async () => {
    const dep = new Department({ name: 'HR' });
    await dep.save();

    expect(dep.isNew).to.equal(false);        // po zapisie nie jest „nowy”
    expect(dep._id).to.exist;

    const fromDb = await Department.findOne({ name: 'HR' });
    expect(fromDb).to.be.an('object');
    expect(fromDb.name).to.equal('HR');
  });

  it('powinno rzucić błąd przy braku wymaganego pola', async () => {
    const dep = new Department({}); // brak name
    let err = null;
    try {
      await dep.save();
    } catch (e) {
      err = e;
    }
    expect(err).to.exist;
    // opcjonalnie: expect(err.name).to.equal('ValidationError');
  });
});


 describe('UPDATE', () => {
  // seed do testów UPDATE
  beforeEach(async () => {
    await Department.insertMany([
      { name: 'QA' },
      { name: 'Support' },
      { name: 'Support' },
    ]);
  });

  it('updateOne() aktualizuje dokument', async () => {
    await Department.updateOne({ name: 'QA' }, { $set: { name: 'Quality Assurance' } });

    const after = await Department.findOne({ name: 'Quality Assurance' });
    expect(after).to.be.an('object');
    expect(after.name).to.equal('Quality Assurance');

    const old = await Department.findOne({ name: 'QA' });
    expect(old).to.be.null;
  });

  it('modyfikacja pola + save() zapisuje zmiany', async () => {
    const doc = await Department.findOne({ name: 'Support' });
    doc.name = 'Customer Support';
    await doc.save();

    const check = await Department.findOne({ _id: doc._id });
    expect(check.name).to.equal('Customer Support');
  });

  it('updateMany() aktualizuje wiele dokumentów', async () => {
    const res = await Department.updateMany({ name: 'Support' }, { $set: { name: 'Tech Support' } });
    expect(res.acknowledged).to.equal(true);
    // w nowych wersjach mongoose: res.modifiedCount
    expect(res.modifiedCount || res.nModified).to.be.greaterThan(0);

    const leftOld = await Department.find({ name: 'Support' });
    expect(leftOld.length).to.equal(0);

    const allNew = await Department.find({ name: 'Tech Support' });
    expect(allNew.length).to.equal(2);
  });
});


 describe('DELETE', () => {
  // seed — kilka rekordów do usuwania
  beforeEach(async () => {
    await Department.insertMany([
      { name: 'Logistics' },
      { name: 'Sales' },
      { name: 'Marketing' },
    ]);
  });

  it('deleteOne() usuwa pojedynczy dokument', async () => {
    await Department.deleteOne({ name: 'Sales' });

    const check = await Department.findOne({ name: 'Sales' });
    expect(check).to.be.null;

    const count = await Department.countDocuments();
    expect(count).to.equal(2);
  });

  it('deleteMany() usuwa wiele dokumentów', async () => {
    await Department.deleteMany({});

    const count = await Department.countDocuments();
    expect(count).to.equal(0);
  });
});
});