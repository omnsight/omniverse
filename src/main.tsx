import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import App from './App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, Modal, Popover, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppAuthProvider } from './utilties/AuthProvider.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/index.ts';

const theme = createTheme({
  primaryColor: 'blue',
  autoContrast: true, // Automatically adjusts text color based on background
  components: {
    Modal: Modal.extend({
      defaultProps: { zIndex: 1200 },
    }),
    Popover: Popover.extend({
      defaultProps: { zIndex: 1300 },
    }),
    Tooltip: {
      defaultProps: { zIndex: 1400 },
    }
  },
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <I18nextProvider i18n={i18n}>
          <AppAuthProvider>
            <App />
          </AppAuthProvider>
        </I18nextProvider>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
