import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import postcssPlugins from './postcss.config'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  plugins: [
    uni(),
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia', 'vue-i18n'],
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': './src'
    }
  },
  css: {
    postcss: {
      plugins: postcssPlugins
    }
  }
})
