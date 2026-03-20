import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result.data || result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useApiMutation = (apiCall) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      return result.data || result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return { mutate, loading, error };
};

export const usePaginatedApi = (apiCall, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });

  const fetchData = useCallback(async (page = 1, newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall({ ...params, ...newParams, page });
      setData(result.data?.[Object.keys(result.data)[0]] || []);
      setPagination({
        page,
        limit: result.limit || 20,
        total: result.total || 0,
        pages: result.pages || 0
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiCall, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    pagination, 
    refetch: fetchData,
    nextPage: () => fetchData(pagination.page + 1),
    prevPage: () => fetchData(pagination.page - 1),
    goToPage: (page) => fetchData(page)
  };
};
