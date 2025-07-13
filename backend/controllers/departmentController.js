// backend/controllers/departmentController.js
const Department = require('../models/Department');

exports.createDepartment = async (req, res) => {
  try {
    const dept = new Department({ name: req.body.name });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating department' });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const list = await Department.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error reading departments' });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!dept) return res.status(404).json({ message: 'Not found' });
    res.json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating department' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting department' });
  }
};
