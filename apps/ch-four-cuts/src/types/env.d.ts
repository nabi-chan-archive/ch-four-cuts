interface ImportMetaEnv {
  readonly VITE_WSS_HOST: string;
  readonly VITE_TRPC_HOST: string;
  readonly VITE_AWS_PROFILE: string;
  readonly VITE_AWS_BUCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
