import { useMemo } from 'react';
import { Api } from '@omnsight/clients/dist/omnibasement/omnibasement.js';
import { useAuth } from './AuthProvider';

export const useBaseApi = () => {
  const { token } = useAuth();

  return useMemo(() => {
    return new Api({
      baseURL: import.meta.env.VITE_BASE_API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }, [token]);
};