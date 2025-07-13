import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DepartmentList.css';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch (err) {
      alert('Unable to load departments');
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!newDepartment.trim()) return alert('Please enter a department name');
    try {
      await axios.post('http://localhost:5000/api/departments', { name: newDepartment });
      setNewDepartment('');
      fetchDepartments();
    } catch (err) {
      alert('Failed to add department');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/departments/${id}`);
      fetchDepartments();
    } catch (err) {
      alert('Delete failed');
      console.error(err);
    }
  };

  const handleEditClick = (dep) => {
    setEditId(dep._id);
    setEditName(dep.name);
  };

  const handleEditSave = async () => {
    if (!editName.trim()) return alert('Department name cannot be empty');
    try {
      await axios.put(`http://localhost:5000/api/departments/${editId}`, { name: editName });
      setEditId(null);
      setEditName('');
      fetchDepartments();
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  const filtered = departments.filter(dep =>
    dep.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const start = (currentPage - 1) * departmentsPerPage;
  const paged = filtered.slice(start, start + departmentsPerPage);
  const totalPages = Math.ceil(filtered.length / departmentsPerPage);

  return (
    <div className="department-management">
      <h2>🏢 Department Management</h2>

      <div className="controls-bar">
        <input
          type="text"
          placeholder="Search department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="add-bar">
          <input
            type="text"
            placeholder="New department"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <button className="btn add" onClick={handleAdd}>Add</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Department Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map((dep, idx) => (
            <tr key={dep._id}>
              <td>{start + idx + 1}</td>
              <td>
                {editId === dep._id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  dep.name
                )}
              </td>
              <td>
                {editId === dep._id ? (
                  <>
                    <button className="btn save" onClick={handleEditSave}>Save</button>
                    <button className="btn cancel" onClick={() => setEditId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn edit" onClick={() => handleEditClick(dep)}>Edit</button>
                    <button className="btn delete" onClick={() => handleDelete(dep._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length > departmentsPerPage && (
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ⬅ Prev
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
