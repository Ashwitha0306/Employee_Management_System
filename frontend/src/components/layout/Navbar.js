// src/components/layout/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        backgroundColor: '#1e3a8a', // dark blue
        color: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <AdminPanelSettingsIcon fontSize="medium" />
          <Typography variant="h6" component="div">
            Admin Panel
          </Typography>
        </Box>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            color: 'white',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#2563eb',
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
