import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppNavbar } from './components/AppNavbar';
import { AppSidebar } from './components/AppSidebar';
import { Geovision } from './pages/Geovision';
import { DataPlane } from './pages/DataPlane';
import { ErrorPage } from './pages/ErrorPage';

function App() {
  const [opened, { toggle }] = useDisclosure();

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
      >
        <AppSidebar />
        <AppNavbar opened={opened} toggle={toggle} />

        <AppShell.Main style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 60 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/geovision" replace />} />
            <Route path="/geovision" element={<Geovision />} />
            <Route path="/dataplane" element={<DataPlane />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App
