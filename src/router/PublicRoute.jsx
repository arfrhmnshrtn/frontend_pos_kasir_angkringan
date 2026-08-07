import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/common/Loading';

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Memeriksa status login..." />;
  }

  if (isAuthenticated) {
    const roleName = (typeof role === 'string' ? role : role?.name || '').toUpperCase();
    if (roleName === 'KASIR') {
      return <Navigate to="/pos" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
