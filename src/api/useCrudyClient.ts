import { useEffect } from 'react';
import { client } from 'omni-osint-crud-client/client';
import { useAuth } from '../provider/AuthContext';

export const useCrudClient = () => {
  const { user } = useAuth();
  client.setConfig({
    baseURL: import.meta.env.VITE_OSINT_CRUD_API_BASE_URL,
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

  return { crudClient: client, authed: !!user };
};
