import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SalaryList.css';

const SalaryList = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    empId: '', empName: '', amount: '', month: '', year: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchId, setSearchId] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2024, 2023];

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/salaries');
      setSalaries(res.data);
    } catch {
      alert('❌ Failed to fetch salary records.');
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch {
      alert('❌ Failed to fetch employee list.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'empId') {
      const emp = employees.find(emp => emp._id === value);
      setForm({
        ...form,
        empId: value,
        empName: emp?.name || ''
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const resetForm = () => {
    setForm({ empId: '', empName: '', amount: '', month: '', year: '' });
    setEditingId(null);
  };

  const handleAdd = async () => {
    const { empId, amount, month, year } = form;
    if (!empId || !amount || !month || !year) {
      alert('⚠️ Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/salaries', form);
      alert('✅ Salary record added.');
      fetchSalaries();
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.error || '❌ Failed to add salary record.';
      alert(msg);
    }
  };

  const handleEditInit = (salary) => {
    setEditingId(salary._id);
    setForm({
      empId: salary.empId,
      empName: salary.empName,
      amount: salary.amount,
      month: salary.month,
      year: salary.year
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/salaries/${editingId}`, form);
      alert('✅ Salary record updated.');
      fetchSalaries();
      resetForm();
    } catch {
      alert('❌ Failed to update record.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/salaries/${id}`);
      alert('🗑️ Record deleted.');
      fetchSalaries();
    } catch {
      alert('❌ Failed to delete record.');
    }
  };

  const filtered = salaries.filter(s =>
    s.empId?.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="salary-page">
      <h2>Salary Management</h2>

      <div className="form-section">
        <select name="empId" value={form.empId} onChange={handleChange}>
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <select name="month" value={form.month} onChange={handleChange}>
          <option value="">Select Month</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>

        <select name="year" value={form.year} onChange={handleChange}>
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {editingId ? (
          <button className="btn save" onClick={handleUpdate}>Update</button>
        ) : (
          <button className="btn add" onClick={handleAdd}>Add</button>
        )}
      </div>

      <input
        className="search-input"
        placeholder="Search by Emp ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>S No</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Year</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((salary, index) => (
            <tr key={salary._id}>
              <td>{index + 1}</td>
              <td>{salary.empId}</td>
              <td>{salary.empName}</td>
              <td>{salary.month}</td>
              <td>{salary.year}</td>
              <td>₹{parseFloat(salary.amount).toLocaleString()}</td>
              <td>
                <button className="btn edit" onClick={() => handleEditInit(salary)}>Edit</button>
                <button className="btn delete" onClick={() => handleDelete(salary._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryList;
