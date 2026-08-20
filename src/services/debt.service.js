import api from './axios';

export const debtService = {
  getDebts: async (params) => {
    return await api.get('/debts', { params });
  },
  createDebtPayment: async (debtId, payload) => {
    return await api.post(`/debts/${debtId}/payments`, payload);
  }
};
