import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { AppShell, LoadingOverlay } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppTopbar } from './pages/layouts/Topbar';
import { AppSidebar } from './pages/layouts/Sidebar';
import { IntelDashboard } from './pages/IntelPanel';
import { MonitorDashboard } from './pages/MonitorPanel';
import { AdminDashboard } from './pages/AdminPanel';
import { UserProfile } from './pages/UserProfile';
import { ErrorPage } from './pages/ErrorPage';
import { useWindowDragStore } from './stores/windowDragStateStore';
import { useAuth } from 'react-oidc-context';

const PageLayout = () => {
  const [opened] = useDisclosure();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';
  const auth = useAuth();

  return (
    <AppShell
      layout="alt"
      header={{
        height: 60,
        collapsed: isProfilePage,
      }}
      navbar={{
        width: isTablet ? 150 : 200,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="0"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <AppTopbar />
      <AppSidebar />

      <AppShell.Main
        style={{
          height: isProfilePage ? '100vh' : 'calc(100vh - 60px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <LoadingOverlay visible={auth?.isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
        <Routes>
          <Route path="/" element={<Navigate to="/intelligence" replace />} />
          <Route path="/intelligence" element={<IntelDashboard />} />
          <Route path="/monitor" element={<MonitorDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

function App() {
  useEffect(() => {
    const handleGlobalDragEnd = () => {
      useWindowDragStore.getState().actions.setDragging(undefined);
    };

    window.addEventListener('dragend', handleGlobalDragEnd);
    return () => window.removeEventListener('dragend', handleGlobalDragEnd);
  }, []);

  return (
    <BrowserRouter>
      <PageLayout />
    </BrowserRouter>
  );
}

export default App;
