import api from './axios';

export const getMaterialExpenses = async (params) => {
  try {
    const response = await api.get('/expenses/materials', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const createMaterialExpense = async (data) => {
  try {
    const response = await api.post('/expenses/materials', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateMaterialExpense = async (id, data) => {
  try {
    const response = await api.patch(`/expenses/materials/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeMaterialExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/materials/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
