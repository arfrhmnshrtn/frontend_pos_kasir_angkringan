import api from './axios';
import { ENDPOINTS } from '../config/api.config';

export const authService = {
  login: async (credentials) => {
    // credentials: { role: 'OWNER'|'KASIR', userId?: string, pin: string }
    return await api.post(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  logout: async () => {
    try {
      return await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (e) {
      // Even if API logout fails, caller will clear client storage
      return { success: true };
    }
  },

  refresh: async (refreshToken) => {
    return await api.post(ENDPOINTS.AUTH.REFRESH, { refreshToken });
  },

  changePin: async (data) => {
    // data: { currentPin?: string, newPin: string }
    return await api.post(ENDPOINTS.AUTH.CHANGE_PIN, data);
  },
};
