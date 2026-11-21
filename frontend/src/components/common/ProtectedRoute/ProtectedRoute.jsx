import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div className="container" style={{ padding: '5rem 1rem', textAlign: 'center' }}>Restoring your VELOCE session...</div>;
  }

  if (!isAuthenticated) {
    // Preserve requested path and search params in location.state
    const fromPath = `${location.pathname}${location.search || ''}`;
    return <Navigate to="/login" state={{ from: fromPath }} replace />;
  }

  return children;
}

export default ProtectedRoute;
