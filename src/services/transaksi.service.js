import api from './axios';

export const transaksiService = {
  getAll: async () => {
    const res = await api.get('/transaksi-keuangan');
    // axios interceptor already returns response.data
    return res;
  },
};
