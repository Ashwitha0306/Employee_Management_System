import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    department: '',
    salary: ''
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    department: '',
    salary: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    let updated = [...employees];

    updated = updated.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOption) {
      case 'name-asc': updated.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': updated.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'salary-asc': updated.sort((a, b) => a.salary - b.salary); break;
      case 'salary-desc': updated.sort((a, b) => b.salary - a.salary); break;
      default: break;
    }

    setFilteredEmployees(updated);
    setCurrentPage(1);
  }, [searchTerm, employees, sortOption]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees');
      setEmployees(res.data);
    } catch {
      alert('Failed to fetch employees.');
    }
  };

  const handleChange = e => {
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { name, email, department, salary } = newEmployee;
    if (!name || !email || !department || !salary) {
      return alert("Please fill in all fields!");
    }

    try {
      await axios.post('http://localhost:5000/api/employees', newEmployee);
      setNewEmployee({ name: '', email: '', department: '', salary: '' });
      fetchEmployees();
      alert('Employee added successfully!');
    } catch {
      alert('Failed to add employee.');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
      alert('Employee deleted successfully!');
    } catch {
      alert('Failed to delete employee.');
    }
  };

  const handleEditClick = emp => {
    setEditId(emp._id);
    setEditData({ name: emp.name, email: emp.email, department: emp.department, salary: emp.salary });
  };

  const handleEditChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async id => {
    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, editData);
      setEditId(null);
      fetchEmployees();
      alert('Employee updated successfully!');
    } catch {
      alert('Failed to update employee.');
    }
  };

  const handleCancel = () => setEditId(null);

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="employee-management">
      <h2>Manage Employees</h2>

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search by name, email or department"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="name-asc">Name ↑</option>
          <option value="name-desc">Name ↓</option>
          <option value="salary-asc">Salary ↑</option>
          <option value="salary-desc">Salary ↓</option>
        </select>
      </div>

      <div className="input-container">
        <input type="text" name="name" placeholder="Name" value={newEmployee.name} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" value={newEmployee.email} onChange={handleChange} />
        <input type="text" name="department" placeholder="Department" value={newEmployee.department} onChange={handleChange} />
        <input type="number" name="salary" placeholder="Salary" value={newEmployee.salary} onChange={handleChange} />
        <button onClick={handleAdd} className="btn add">Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>S No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((emp, index) => (
            <tr key={emp._id}>
              <td>{indexOfFirst + index + 1}</td>
              {editId === emp._id ? (
                <>
                  <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
                  <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                  <td><input name="department" value={editData.department} onChange={handleEditChange} /></td>
                  <td><input name="salary" value={editData.salary} onChange={handleEditChange} /></td>
                  <td>
                    <button className="btn save" onClick={() => handleEditSave(emp._id)}>Save</button>
                    <button className="btn cancel" onClick={handleCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>₹{parseInt(emp.salary).toLocaleString()}</td>
                  <td>
                    <button className="btn edit" onClick={() => handleEditClick(emp)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(emp._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>⬅ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next ➡</button>
      </div>
    </div>
  );
};

export default EmployeeList;
