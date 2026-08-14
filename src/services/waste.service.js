import api from './axios';

export const wasteService = {
  getWastes: async (params) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.set(key, value);
        }
      });
    }
    const qs = query.toString();
    const res = await api.get(`/wastes${qs ? `?${qs}` : ''}`);
    return res;
  },
  getWasteById: async (id) => {
    const res = await api.get(`/wastes/${id}`);
    return res;
  },
  createWaste: async (data) => {
    const res = await api.post('/wastes', data);
    return res;
  },
  updateWaste: async (id, data) => {
    const res = await api.patch(`/wastes/${id}`, data);
    return res;
  },
  deleteWaste: async (id) => {
    const res = await api.delete(`/wastes/${id}`);
    return res;
  },
  getSummary: async (params) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.set(key, value);
        }
      });
    }
    const qs = query.toString();
    const res = await api.get(`/wastes/summary${qs ? `?${qs}` : ''}`);
    return res;
  },
  getAnalysis: async (params) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.set(key, value);
        }
      });
    }
    const qs = query.toString();
    const res = await api.get(`/wastes/analysis${qs ? `?${qs}` : ''}`);
    return res;
  }
};
