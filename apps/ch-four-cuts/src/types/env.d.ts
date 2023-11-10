interface ImportMetaEnv {
  readonly VITE_WSS_HOST: string;
  readonly VITE_TRPC_HOST: string;
  readonly AWS_PROFILE: string;
  readonly AWS_BUCKET: string;
  readonly APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
