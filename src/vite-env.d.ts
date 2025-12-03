interface ImportMetaEnv {
  readonly REALM: string;
  readonly KEYCLOAK_CLIENT_ID: string;
  readonly KEYCLOAK_API_URL: string;
  readonly BASE_API_URL: string;
  readonly GEO_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}