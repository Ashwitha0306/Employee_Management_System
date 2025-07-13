// backend/routes/employees.js

const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new employee (Default password = 'employee123')
router.post('/', async (req, res) => {
  try {
    const { name, email, department, salary } = req.body;

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Employee already exists' });
    }

    const hashedPassword = await bcrypt.hash('employee123', 10);

    const employee = new Employee({
      name,
      email,
      department,
      salary,
      password: hashedPassword
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    console.error('Add employee error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Employee Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({ employee });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
