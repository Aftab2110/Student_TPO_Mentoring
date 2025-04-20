import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Center, Spinner } from '@chakra-ui/react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, company, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // Debug current location and auth state
  useEffect(() => {
    console.log('ProtectedRoute - Current location:', location.pathname);
    console.log('ProtectedRoute - Auth state:', { user, company, isLoading });
  }, [location, user, company, isLoading]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  // Check if user is authenticated (either as user or company)
  if (!user && !company) {
    console.log('ProtectedRoute - No user or company found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If company is trying to access user routes or vice versa
  if (allowedRoles) {
    if (company && !allowedRoles.includes('company')) {
      console.log('ProtectedRoute - Company trying to access non-company route');
      return <Navigate to="/company/dashboard" replace />;
    }
    if (user && !allowedRoles.includes(user.role)) {
      console.log('ProtectedRoute - User trying to access non-allowed route');
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted');
  return <Outlet />;
};

export default ProtectedRoute;