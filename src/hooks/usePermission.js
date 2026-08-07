import { useAuth } from './useAuth';
import { hasPermission as checkPermission, hasRole as checkRole } from '../utils/permissions';

export const usePermission = () => {
  const { permissions, role } = useAuth();

  const hasPermission = (required) => checkPermission(permissions, required);
  const hasRole = (requiredRole) => checkRole(role, requiredRole);

  return {
    permissions,
    role,
    hasPermission,
    hasRole,
  };
};
