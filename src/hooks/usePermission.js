import { useAuth } from "./useAuth";
import { useCallback } from "react";
import {
  hasPermission as checkPermission,
  hasRole as checkRole,
} from "../utils/permissions";

export const usePermission = () => {
  const { permissions, role } = useAuth();

  const hasPermission = useCallback(
    (required) => {
      if (checkRole(role, "OWNER")) return true;
      if (checkRole(role, "KASIR") && (required === 'debt.read' || required === 'debt.payment')) return true;
      return checkPermission(permissions, required);
    },
    [permissions, role],
  );
  const hasRoleHook = useCallback(
    (requiredRole) => checkRole(role, requiredRole),
    [role],
  );

  return {
    permissions,
    role,
    hasPermission,
    hasRole: hasRoleHook,
  };
};
