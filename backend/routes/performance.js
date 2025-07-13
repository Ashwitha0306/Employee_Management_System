const express = require('express');
const router = express.Router();
const Performance = require('../models/Performance');

// Create
router.post('/', async (req, res) => {
  try {
    const perf = new Performance(req.body);
    await perf.save();
    res.status(201).json(perf);
  } catch (err) {
    console.error('Error creating performance:', err);
    res.status(400).json({ error: err.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const data = await Performance.find().populate('empId', 'name');
    const formatted = data.map(p => ({
      _id: p._id,
      empId: p.empId._id,
      empName: p.empId.name,
      month: p.month,
      year: p.year,
      rating: p.rating,
      remarks: p.remarks
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Read by empId
router.get('/:empId', async (req, res) => {
  try {
    const data = await Performance.find({ empId: req.params.empId }).populate('empId', 'name');
    const formatted = data.map(p => ({
      _id: p._id,
      empId: p.empId._id,
      empName: p.empId.name,
      month: p.month,
      year: p.year,
      rating: p.rating,
      remarks: p.remarks
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee performance' });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Performance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Performance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
