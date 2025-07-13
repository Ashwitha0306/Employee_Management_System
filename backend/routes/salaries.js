const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Employee = require('../models/Employee');

// Add Salary
router.post('/', async (req, res) => {
  try {
    const { empId, empName, amount, month, year } = req.body;
    if (!empId || !amount || !month || !year) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = await Salary.findOne({ empId, month, year });
    if (existing) {
      return res.status(400).json({ error: 'Salary already exists for this month & year' });
    }

    const newSalary = new Salary({ empId, empName, amount, month, year });
    await newSalary.save();

    await Employee.findByIdAndUpdate(empId, { salary: amount });

    res.status(201).json(newSalary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add salary' });
  }
});

// Update Salary
router.put('/:id', async (req, res) => {
  try {
    const { empId, empName, amount, month, year } = req.body;

    const updated = await Salary.findByIdAndUpdate(req.params.id, {
      empId, empName, amount, month, year
    }, { new: true });

    await Employee.findByIdAndUpdate(empId, { salary: amount });

    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update salary' });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Get All
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find();
    res.json(salaries);
  } catch {
    res.status(500).json({ error: 'Fetch error' });
  }
});
// Get salaries for a specific employee by ID
router.get('/employee/:id', async (req, res) => {
  try {
    const salaries = await Salary.find({ empId: req.params.id });
    res.json(salaries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch employee salary' });
  }
});


module.exports = router;
