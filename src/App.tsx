import { useDisclosure } from '@mantine/hooks';
import { useEffect } from 'react';
import { client as OsintQueryClient } from 'omni-osint-query-client/client';
import { client as OsintCrudClient } from 'omni-osint-crud-client/client';
import { client as MonitoringClient } from 'omni-monitoring-client/client';
import { AppShell } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppTopbar } from './pages/layouts/Topbar';
import { AppSidebar } from './pages/layouts/Sidebar';
import { IntelDashboard } from './pages/IntelPanel';
import { MonitorDashboard } from './pages/MonitorPanel';
import { AdminDashboard } from './pages/AdminPanel';
import { ErrorPage } from './pages/ErrorPage';
import { useWindowStore } from './stores/windowStateStore';
import { useAuth } from './provider/AuthContext';

function App() {
  const [opened] = useDisclosure();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      OsintCrudClient.setConfig({
        baseURL: import.meta.env.VITE_OSINT_CRUD_API_BASE_URL,
        withCredentials: true,
      });
      OsintCrudClient.instance.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${user.token}`;
        return config;
      });
      OsintQueryClient.setConfig({
        baseURL: import.meta.env.VITE_OSINT_QUERY_API_BASE_URL,
        withCredentials: true,
      });
      OsintQueryClient.instance.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${user.token}`;
        return config;
      });
      MonitoringClient.setConfig({
        baseURL: import.meta.env.VITE_MONITORING_API_BASE_URL,
        withCredentials: true,
      });
      MonitoringClient.instance.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${user.token}`;
        return config;
      });
    }
  }, [user]);

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      useWindowStore.getState().actions.setDragging(undefined);
    };

    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => window.removeEventListener('dragend', handleGlobalDragEnd);
  }, []);

  return (
    <BrowserRouter>
      <AppShell
        layout="alt"
        header={{ height: 60 }}
        navbar={{
          width: 200,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="0"
        style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <AppTopbar />
        <AppSidebar />

        <AppShell.Main
          style={{
            height: 'calc(100vh - 60px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/geovision" replace />} />
            <Route path="/intelligence" element={<IntelDashboard />} />
            <Route path="/monitor" element={<MonitorDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
