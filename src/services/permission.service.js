import api from './axios';
import { ENDPOINTS } from '../config/api.config';

export const permissionService = {
  getPermissions: async () => {
    return await api.get(ENDPOINTS.PERMISSIONS);
  },
};
