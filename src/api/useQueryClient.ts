import { useEffect } from 'react';
import { client } from 'omni-osint-query-client/client';
import { useAuth } from '../provider/AuthContext';

export const useQueryClient = () => {
  const { user } = useAuth();
  client.setConfig({
    baseURL: import.meta.env.VITE_OSINT_QUERY_API_BASE_URL,
  });

  useEffect(() => {
    if (user) {
      client.setConfig({
        withCredentials: true,
      });
      client.instance.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${user.token}`;
        return config;
      });
    }
  }, [user]);

  return { queryClient: client, authed: !!user };
};
