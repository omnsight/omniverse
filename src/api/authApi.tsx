import { useMemo } from 'react';
import { Api } from '@omnsight/clients/dist/omniauth/omniauth.js';
import { useAuth } from '../provider/AuthContext';

export const useAuthApi = () => {
  const { token } = useAuth();

  return useMemo(() => {
    return new Api({
      baseURL: import.meta.env.VITE_AUTH_API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }, [token]);
};
