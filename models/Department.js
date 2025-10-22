// models/Department.js
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 50 },
});

module.exports = mongoose.model('Department', DepartmentSchema);
