interface ImportMetaEnv {
  readonly VITE_USE_MOCK_AUTH: 'true' | 'false';
  readonly VITE_OIDC_AUTHORITY: string;
  readonly VITE_OIDC_CLIENT_ID: string;
  readonly VITE_OSINT_QUERY_API_BASE_URL: string;
  readonly VITE_OSINT_CRUD_API_BASE_URL: string;
  readonly VITE_MONITORING_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
