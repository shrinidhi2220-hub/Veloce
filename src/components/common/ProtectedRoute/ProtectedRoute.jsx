import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve requested path and search params in location.state
    const fromPath = `${location.pathname}${location.search || ''}`;
    return <Navigate to="/login" state={{ from: fromPath }} replace />;
  }

  return children;
}

export default ProtectedRoute;
