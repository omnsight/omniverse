import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@material-tailwind/react";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";
import { KEYCLOAK_CLIENT_ID } from './constants.tsx';

const oidcConfig = {
  authority: import.meta.env.VITE_KEYCLOAK_URL,
  client_id: KEYCLOAK_CLIENT_ID,
  redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)