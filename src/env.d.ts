/// <reference types="vite/client" />

declare module '*.vue' {
}

declare module '@climblee/uv-ui';

declare module 'postcss-pxtransform';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENC_KEY: string;
  readonly VITE_ENC_IV: string;
  readonly VITE_ENC_ALG: 'aes' | 'des' | 'sm4'
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}