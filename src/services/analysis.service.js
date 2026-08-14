import api from './axios';

export const getSalesAnalysis = async (params) => {
  try {
    const response = await api.get('/analysis/sales', {
      params
    });
    return response;
  } catch (error) {
    throw error;
  }
};
