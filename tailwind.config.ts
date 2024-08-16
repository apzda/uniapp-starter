import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import cssMacro from 'weapp-tailwindcss/css-macro'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'
import { isMp } from './platform'

export default <Config>{
  content: ['./index.html', './src/**/*.{ts,vue}'],
  darkMode: ['variant', ':is(.dark &)'],
  theme: {
    extend: {}
  },

  plugins: [
    plugin(({ addVariant }) => {
      addVariant('deep', ':is(.deep &)')
      addVariant('fantasy', ':is(.fantasy &)')
    }),
    //@ts-ignore
    cssMacro({
      variantsMap: {
        'wx': 'MP-WEIXIN',
        '-wx': {
          value: 'MP-WEIXIN',
          negative: true
        }
      }
    }),
    iconsPlugin({
      // https://weapp-tw.icebreaker.top/docs/icons
      // Select the icon collections you want to use
      // https://icones.js.org
      collections: getIconCollections(['mdi', 'lucide'])
    })
  ],
  corePlugins: {
    preflight: !isMp,
    container: !isMp
  }
}