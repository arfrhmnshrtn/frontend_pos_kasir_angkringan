import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { hasPermission as checkPermission, hasRole as checkRole } from '../utils/permissions';
import { Loading } from '../components/common/Loading';

export const RoleRoute = ({ allowedRoles, requiredPermission, children }) => {
  const { role, permissions, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading fullScreen text="Memeriksa hak akses..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check Role requirement
  if (allowedRoles) {
    const isRoleAllowed = checkRole(role, allowedRoles);
    if (!isRoleAllowed) {
      return <Navigate to="/403" replace />;
    }
  }

  // Check Permission requirement
  if (requiredPermission) {
    const isPermAllowed = checkPermission(permissions, requiredPermission);

    // Fallback: If permissions array is empty or not provided by backend, allow if role matched
    if (!isPermAllowed) {
      const roleName = (typeof role === 'string' ? role : role?.name || '').toUpperCase();
      if (allowedRoles && checkRole(roleName, allowedRoles)) {
        return children;
      }
      return <Navigate to="/403" replace />;
    }
  }

  return children;
};
