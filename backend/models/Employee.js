// backend/models/Employee.js

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true  // ensure password is not missing
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
