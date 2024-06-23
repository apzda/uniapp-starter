import { isMp } from './platform'

export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  darkMode: 'media',
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: !isMp
  }
}