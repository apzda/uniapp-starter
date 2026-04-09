import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'
import { isMp } from './platform'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then((i) => i.default),
        lucide: () => import('@iconify-json/lucide/icons.json').then((i) => i.default)
      },
      scale: 1.2,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  darkMode: 'media',
  theme: {
    colors: {
      primary: '#007AFF'
    }
  },
  variants: [
    // 自定义 dark variant (与 Tailwind 兼容)
    (matcher) => {
      if (!matcher.startsWith('dark:')) return matcher
      return {
        matcher: matcher.slice(5),
        parent: '@media (prefers-color-scheme: dark)'
      }
    }
  ],
  rules: [
    // 小程序端禁用 preflight 相关的 reset
    ...(isMp
      ? []
      : [
          // 可在此添加自定义 preflight 规则
        ])
  ],
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center'
  }
})
