/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly VITE_ORCHESTRATOR_URL: string;
  readonly VITE_TANSTACK_QUERY_DEVTOOLS: boolean;

  readonly VITE_FB_API_KEY: string;
  readonly VITE_FB_AUTH_DOMAIN: string;
  readonly VITE_FB_PROJECT_ID: string;
  readonly VITE_FB_STORAGE_BUCKET: string;
  readonly VITE_FB_MESSAGING_SENDER_ID: string;
  readonly VITE_FB_APP_ID: string;
  readonly VITE_FB_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
