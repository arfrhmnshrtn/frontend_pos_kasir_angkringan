import api from './axios';

export const getCashReports = async (params) => {
  return await api.get('/cash/reports', { params });
};

export const getCashBalance = async (params) => {
  return await api.get('/cash/balance', { params });
};

export const getCashFlow = async (params) => {
  return await api.get('/cash/flow', { params });
};

export const getCashTransactions = async (params) => {
  return await api.get('/cash/transactions', { params });
};

export const getIncomeBreakdown = async (params) => {
  return await api.get('/cash/income-breakdown', { params });
};

export const getExpenseBreakdown = async (params) => {
  return await api.get('/cash/expense-breakdown', { params });
};

export const getBudgets = async () => {
  return await api.get('/cash/budget');
};

export const createBudget = async (payload) => {
  return await api.post('/cash/budget', payload);
};

export const updateBudget = async (id, payload) => {
  return await api.patch(`/cash/budget/${id}`, payload);
};

export const deleteBudget = async (id) => {
  return await api.delete(`/cash/budget/${id}`);
};
