import api from './axios';

export const debtService = {
  getDebts: async () => {
    return await api.get('/debts');
  },
  createDebtPayment: async (debtId, payload) => {
    return await api.post(`/debts/${debtId}/payments`, payload);
  }
};
