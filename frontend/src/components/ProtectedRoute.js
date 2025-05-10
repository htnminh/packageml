import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, fetchUserData } = useAuth();
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // If there's a token but no user data, try to fetch user data
    if (token && !isAuthenticated() && !loading) {
      fetchUserData(token);
    }
  }, [token, isAuthenticated, loading, fetchUserData]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // If no token exists, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists but auth check failed, allow access but will try to fetch user in background
  return children;
};

export default ProtectedRoute; 