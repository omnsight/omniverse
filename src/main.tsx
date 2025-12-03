import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import App from './App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { AppAuthProvider } from './utilties/AuthProvider.tsx';

const theme = createTheme({
  primaryColor: 'blue',
  autoContrast: true, // Automatically adjusts text color based on background
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppAuthProvider>
        <App />
      </AppAuthProvider>
    </MantineProvider>
  </StrictMode>,
)
