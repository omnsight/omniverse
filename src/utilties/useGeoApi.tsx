import { useMemo } from 'react';
import { Api } from '@omnsight/clients/dist/geovision/geovision.js';
import { useAuth } from './AuthProvider';

export const useGeoApi = () => {
  const { token } = useAuth();

  return useMemo(() => {
    return new Api({
      baseURL: import.meta.env.VITE_GEO_API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
  }, [token]);
};