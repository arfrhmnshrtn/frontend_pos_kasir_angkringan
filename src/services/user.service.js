import api from './axios';
import { ENDPOINTS } from '../config/api.config';

export const userService = {
  getKasirUsers: async () => {
    return await api.get(ENDPOINTS.USERS.KASIR);
  },

  getUsers: async (params = {}) => {
    return await api.get(ENDPOINTS.USERS.BASE, { params });
  },

  createUser: async (userData) => {
    return await api.post(ENDPOINTS.USERS.BASE, userData);
  },

  updateUser: async (id, userData) => {
    return await api.patch(ENDPOINTS.USERS.BY_ID(id), userData);
  },

  updateUserStatus: async (id, status) => {
    return await api.patch(ENDPOINTS.USERS.STATUS(id), { status });
  },

  resetUserPin: async (id, newPin) => {
    return await api.patch(ENDPOINTS.USERS.RESET_PIN(id), { newPin });
  },

  changeProfilePin: async (data) => {
    // data: { oldPin: string, newPin: string }
    return await api.patch(ENDPOINTS.USERS.CHANGE_PROFILE_PIN, data);
  },

  deleteUser: async (id) => {
    return await api.delete(ENDPOINTS.USERS.BY_ID(id));
  },
};
