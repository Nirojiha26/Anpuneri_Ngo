import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

// Generic data-fetching hook
export const useApi = (apiFn, params = {}, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(params);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Pagination hook
export const usePagination = (initialPage = 1, initialLimit = 9) => {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);

  const goToPage = (newPage) => setPage(newPage);
  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const reset = () => setPage(1);

  return { page, limit, goToPage, nextPage, prevPage, reset };
};

// Debounce hook
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Async action hook with toast
export const useAsyncAction = () => {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async (fn, { successMsg, errorMsg } = {}) => {
    setLoading(true);
    try {
      const result = await fn();
      if (successMsg) toast.success(successMsg);
      return { success: true, data: result };
    } catch (err) {
      const msg = err.response?.data?.message || errorMsg || 'An error occurred';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, execute };
};

// Click outside hook
export const useClickOutside = (callback) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);

  return ref;
};

// Scroll to top hook
export const useScrollTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
};

// Local storage hook
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
};

// Intersection Observer hook
export const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};
