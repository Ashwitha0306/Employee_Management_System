const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  empName: String,
  amount: Number,
  month: String,
  year: Number
}, { timestamps: true });

module.exports = mongoose.model('Salary', SalarySchema);
