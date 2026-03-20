import { useEffect } from 'react';
import { client } from 'omni-monitoring-client/client';
import { useAuth } from '../provider/AuthContext';

export const useMonitoringClient = () => {
  const { user } = useAuth();
  client.setConfig({
    baseURL: import.meta.env.VITE_MONITORING_API_BASE_URL,
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

  return client;
};
