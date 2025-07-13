const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  empName: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  remarks: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
