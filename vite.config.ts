import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"
import AutoImport from 'unplugin-auto-import/vite'
import { UnifiedViteWeappTailwindcssPlugin as uvwt } from 'weapp-tailwindcss/vite'
import postcssPlugins from './postcss.config.js'
import { WeappTailwindcssDisabled } from './platform'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    uvwt({
      rem2rpx: true, disabled: WeappTailwindcssDisabled, injectAdditionalCssVarScope: true
    }),
    AutoImport({
      imports: ['vue', 'uni-app', 'pinia'],
      dts: './src/auto-imports.d.ts',
      eslintrc: {
        enabled: true
      }
    })
  ],
  css: {
    postcss: {
      plugins: postcssPlugins
    }
  }
});