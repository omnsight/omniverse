import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Geovision } from './pages/Geovision';
import { ErrorPage } from './pages/ErrorPage';
import { AppTopbar } from './components/common/Topbar';
import { AppSidebar } from './components/common/Sidebar';
import { SparkGraph } from './pages/SparkGraph';

function App() {
  const [opened] = useDisclosure();

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
        <AppTopbar />
        <AppSidebar />

        <AppShell.Main
          style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 60 }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/geovision" replace />} />
            <Route path="/geovision" element={<Geovision />} />
            <Route path="/sparkgraph" element={<SparkGraph />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </AppShell.Main>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
