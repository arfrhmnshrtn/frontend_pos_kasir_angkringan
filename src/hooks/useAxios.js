import { useState, useCallback } from 'react';
import api from '../services/axios';

export const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(config);
      setLoading(false);
      return response;
    } catch (err) {
      setLoading(false);
      setError(err);
      throw err;
    }
  }, []);

  return { request, loading, error, api };
};
