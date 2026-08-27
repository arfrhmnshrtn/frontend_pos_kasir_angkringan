import api from './axios';

export const getDashboard = async () => {
  try {
    const response = await api.get('/dashboard');
    return response;
  } catch (error) {
    throw error;
  }
};
