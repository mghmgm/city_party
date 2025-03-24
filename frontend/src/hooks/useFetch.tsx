import { useState } from 'react';

export const useFetch = <T,>(fetchFunction: () => Promise<T>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async ()  => {
    try {
      setIsLoading(true);
      const response = await fetchFunction();
      return response
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
      return null
    }
  };

  return [fetching, error, isLoading];
};
