/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@climblee/uv-ui';

declare module 'postcss-pxtransform';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENC_KEY: string;
  readonly VITE_ENC_IV: string;
  readonly VITE_ENC_MODE: 'CBC'
  readonly VITE_ENC_PADDING: 'PKCS7Padding' | 'PKCS5Padding'
  readonly NODE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}