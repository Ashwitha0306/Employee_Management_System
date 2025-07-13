import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const EmployeeForm = ({ fetchEmployees }) => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: ''
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch department list
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
      alert('Failed to load departments.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/employees', employee, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setEmployee({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: ''
      });
      fetchEmployees();
    } catch (err) {
      console.error('Failed to add employee:', err);
      alert('Something went wrong while adding the employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={4} sx={{ p: 4, mt: 3, mb: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom align="center" color="primary">
        Add New Employee
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <TextField
          label="Name"
          name="name"
          value={employee.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          value={employee.email}
          onChange={handleChange}
          fullWidth
          required
          type="email"
        />
        <TextField
          label="Position"
          name="position"
          value={employee.position}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          select
          label="Department"
          name="department"
          value={employee.department}
          onChange={handleChange}
          fullWidth
          required
        >
          {departments.length === 0 ? (
            <MenuItem disabled>Loading...</MenuItem>
          ) : (
            departments.map((dep) => (
              <MenuItem key={dep._id} value={dep._id}>
                {dep.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Salary"
          name="salary"
          type="number"
          value={employee.salary}
          onChange={handleChange}
          fullWidth
          required
          inputProps={{ min: 0 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Employee'}
        </Button>
      </Box>
    </Paper>
  );
};

export default EmployeeForm;
