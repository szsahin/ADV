import { useCallback } from 'react';

export function useBase64() {
  const encode = useCallback((input: string): string => {
    return btoa(input);
  }, []);

  const decode = useCallback((input: string): string => {
    return atob(input);
  }, []);

  return { encode, decode };
}
