interface ImportMetaEnv {
  readonly VITE_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_KEYCLOAK_API_URL: string;
  readonly VITE_BASE_API_URL: string;
  readonly VITE_GEO_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}