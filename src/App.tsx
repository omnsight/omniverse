import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { AppShell, LoadingOverlay } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppTopbar } from './pages/layouts/Topbar';
import { AppSidebar } from './pages/layouts/Sidebar';
import { IntelDashboard } from './pages/IntelPanel';
import { MonitorDashboard } from './pages/MonitorPanel';
import { AdminDashboard } from './pages/AdminPanel';
import { ErrorPage } from './pages/ErrorPage';
import { useWindowDragStore } from './stores/windowDragStateStore';
import { useAuth } from 'react-oidc-context';

function App() {
  const [opened] = useDisclosure();
  const auth = useAuth();
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    const handleGlobalDragEnd = () => {
      useWindowDragStore.getState().actions.setDragging(undefined);
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
          width: isTablet ? 150 : 200,
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
            position: 'relative',
          }}
        >
          <LoadingOverlay visible={auth.isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
          <Routes>
            <Route path="/" element={<Navigate to="/intelligence" replace />} />
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
