const Performance = require('../models/performanceModel');

// Get all performance records
exports.getAllPerformance = async (req, res) => {
  try {
    const data = await Performance.find().populate('empId', 'name');
    const formatted = data.map(p => ({
      _id: p._id,
      empId: p.empId._id,
      empName: p.empId.name,
      month: p.month,
      year: p.year,
      rating: p.rating,
      remarks: p.remarks,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch performance records' });
  }
};

// Get performance by employee ID (used in employee dashboard)
exports.getPerformanceByEmployeeId = async (req, res) => {
  try {
    const { empId } = req.params;
    const data = await Performance.find({ empId }).populate('empId', 'name');
    const formatted = data.map(p => ({
      _id: p._id,
      empId: p.empId._id,
      empName: p.empId.name,
      month: p.month,
      year: p.year,
      rating: p.rating,
      remarks: p.remarks,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch performance data' });
  }
};

// Create new performance
exports.createPerformance = async (req, res) => {
  try {
    const perf = new Performance(req.body);
    await perf.save();
    res.status(201).json(perf);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create performance record' });
  }
};

// Update performance
exports.updatePerformance = async (req, res) => {
  try {
    const updated = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update performance record' });
  }
};

// Delete performance
exports.deletePerformance = async (req, res) => {
  try {
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete performance record' });
  }
};
