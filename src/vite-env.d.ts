/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_LOCATION_NAME: string;
  readonly VITE_LOCATION_ADDRESS: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
