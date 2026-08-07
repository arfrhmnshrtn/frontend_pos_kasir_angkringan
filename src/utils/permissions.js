/**
  * Check if user has specific permission
  * @param {Array<string|object>} userPermissions - list of permissions or permission objects
  * @param {string|Array<string>} required - permission string or array of permissions (OR logic)
  * @returns {boolean}
  */
export const hasPermission = (userPermissions = [], required) => {
  if (!required) return true;
  if (!userPermissions || !Array.isArray(userPermissions)) return false;

  const permissionsList = userPermissions.map((p) => (typeof p === 'string' ? p : p.name || p.code || ''));

  if (Array.isArray(required)) {
    return required.some((req) => permissionsList.includes(req));
  }

  return permissionsList.includes(required);
};

/**
  * Check if user has specific role
  * @param {string|object} userRole - user role name or object
  * @param {string|Array<string>} requiredRole - required role or list of allowed roles
  * @returns {boolean}
  */
export const hasRole = (userRole, requiredRole) => {
  if (!requiredRole) return true;
  if (!userRole) return false;

  const roleName = (typeof userRole === 'string' ? userRole : userRole?.name || userRole?.code || '').toUpperCase();

  if (Array.isArray(requiredRole)) {
    return requiredRole.map((r) => r.toUpperCase()).includes(roleName);
  }

  return roleName === requiredRole.toUpperCase();
};
