import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import postcssPlugins from './postcss.config'
import { WeappTailwindcssDisabled } from './platform'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
  plugins: [
    uni(),
    uvwt({
      wxsMatcher() {
        return false
      },
      inlineWxs: true,
      rem2rpx: {
        rootValue: 32,
        unitPrecision: 6,
        propList: ['*'],
        transformUnit: 'rpx'
      },
      disabled: WeappTailwindcssDisabled,
      injectAdditionalCssVarScope: true
    }),
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