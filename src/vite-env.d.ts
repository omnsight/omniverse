interface ImportMetaEnv {
  readonly VITE_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_KEYCLOAK_API_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_AUTH: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
