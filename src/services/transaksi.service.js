import api from './axios';

export const transaksiService = {
  getAll: async () => {
    const res = await api.get('/transaksi-keuangan');
    // axios interceptor already returns response.data
    return res;
  },
  createCategory: async (data) => {
    const res = await api.post('/kategori-keuangan', data);
    return res;
  },
  getAllCategories: async () => {
    const res = await api.get('/kategori-keuangan');
    return res;
  },
  createTransaction: async (type, data) => {
    // type is 'pemasukan' or 'pengeluaran'
    const res = await api.post(`/transaksi-keuangan/${type}`, data);
    return res;
  },
  deleteTransaction: async (id) => {
    const res = await api.delete(`/transaksi-keuangan/${id}`);
    return res;
  }
};
