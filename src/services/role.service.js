import api from './axios';
import { ENDPOINTS } from '../config/api.config';

export const roleService = {
  getRoles: async () => {
    return await api.get(ENDPOINTS.ROLES);
  },
};
