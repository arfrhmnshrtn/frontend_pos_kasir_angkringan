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

export const getProductsSold = async (params) => {
  try {
    const response = await api.get('/analysis/products-sold', {
      params
    });
    return response;
  } catch (error) {
    throw error;
  }
};

