import { useState, useCallback } from 'react';
import { api } from '@utils/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiCall, onSuccess, onError) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall();
      onSuccess?.(data);
      return data;
    } catch (err) {
      const errorMessage = err?.message || '请求失败';
      setError(errorMessage);
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, request };
};

