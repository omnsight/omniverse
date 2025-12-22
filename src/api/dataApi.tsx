import { useMemo } from 'react';
import { Api } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { useAuth } from '../provider/AuthContext';

export const useDataApi = () => {
  const { token } = useAuth();

  return useMemo(() => {
    return new Api({
      baseURL: import.meta.env.VITE_DATA_API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }, [token]);
};
