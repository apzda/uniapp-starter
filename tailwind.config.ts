import path from 'path'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import cssMacro from 'weapp-tailwindcss/css-macro'
import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'
import { isMp } from './platform'

function r(...args: string[]) {
  return path.resolve(__dirname, ...args)
}

export default <Config>{
  content: ['./index.html', './src/**/*.{ts,vue}'].map((x) => r(x)),
  darkMode: 'media',
  theme: {
    extend: {}
  },

  plugins: [
    plugin(({ addVariant }) => {
      addVariant('deep', ':is(.deep &)')
      addVariant('fantasy', ':is(.fantasy &)')
      addVariant('wx', '@media(weapp-tw-platform:MP-WEIXIN){&}')
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