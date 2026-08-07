export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    CHANGE_PIN: '/auth/change-pin',
  },
  USERS: {
    BASE: '/users',
    KASIR: '/users/kasir',
    BY_ID: (id) => `/users/${id}`,
    STATUS: (id) => `/users/${id}/status`,
    RESET_PIN: (id) => `/users/${id}/reset-pin`,
  },
  ROLES: '/roles',
  PERMISSIONS: '/permissions',
};
