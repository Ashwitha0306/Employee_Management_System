import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PerformanceList.css';

const PerformanceList = () => {
  const [list, setList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    empId: '', empName: '', month: '', year: '', rating: '', remarks: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2025, 2024, 2023];
  const remarksOptions = ['Excellent', 'Good', 'Average', 'Below Average', 'Poor'];

  // Load employee & performance data
  useEffect(() => {
    loadData();
    axios.get('http://localhost:5000/api/employees')
      .then(res => setEmployees(res.data))
      .catch(err => console.error('Failed to fetch employees', err));
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/performance');
      setList(res.data);
    } catch (err) {
      console.error('Failed to fetch performance data', err);
    }
  };

  // Form Change Handler
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'empId') {
      const emp = employees.find(emp => emp._id === value);
      setForm(prev => ({ ...prev, empId: value, empName: emp?.name || '' }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Reset Form
  const resetForm = () => {
    setForm({ empId: '', empName: '', month: '', year: '', rating: '', remarks: '' });
    setEditingId(null);
  };

  // Add or Update
  const handleAdd = async () => {
    const { empId, month, year, rating, remarks } = form;
    if (!empId || !month || !year || !rating || !remarks) {
      alert('Please fill in all fields!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/performance', form);
      alert('Added successfully');
      resetForm();
      loadData();
    } catch (err) {
      alert('Error adding performance');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/performance/${editingId}`, form);
      alert('Updated successfully');
      resetForm();
      loadData();
    } catch (err) {
      alert('Error updating performance');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/performance/${id}`);
      alert('Deleted successfully');
      loadData();
    } catch (err) {
      alert('Error deleting performance');
    }
  };

  const handleEditInit = (p) => {
    setEditingId(p._id);
    setForm({ ...p });
  };

  // Filtered Results
  const filtered = list.filter(p =>
    p.empId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="performance-page">
      <h2>Performance Management</h2>

      {/* Form Section */}
      <div className="form-section">
        <select name="empId" value={form.empId} onChange={handleChange}>
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>

        <select name="month" value={form.month} onChange={handleChange}>
          <option value="">Select Month</option>
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <select name="year" value={form.year} onChange={handleChange}>
          <option value="">Select Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value="">Rating (1–5)</option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>

        <select name="remarks" value={form.remarks} onChange={handleChange}>
          <option value="">Select Remarks</option>
          {remarksOptions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        {editingId ? (
          <button className="btn save" onClick={handleUpdate}>Update</button>
        ) : (
          <button className="btn add" onClick={handleAdd}>Add</button>
        )}
      </div>

      {/* Search Bar */}
      <input
        className="search-input"
        placeholder="Search by Emp ID"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>S No</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Month</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={p._id}>
              <td>{i + 1}</td>
              <td>{p.empId}</td>
              <td>{p.empName}</td>
              <td>{p.month}</td>
              <td>{p.year}</td>
              <td>{p.rating}</td>
              <td>{p.remarks}</td>
              <td>
                <button className="btn edit" onClick={() => handleEditInit(p)}>Edit</button>
                <button className="btn delete" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceList;
