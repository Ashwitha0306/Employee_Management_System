const Salary = require('../models/Salary');

exports.createSalary = async (req, res) => {
  try {
    const salary = new Salary(req.body);
    await salary.save();
    res.json(salary);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate('employee');
    res.json(salaries);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateSalary = async (req, res) => {
  try {
    const updated = await Salary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteSalary = async (req, res) => {
  try {
    await Salary.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Salary record deleted' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
