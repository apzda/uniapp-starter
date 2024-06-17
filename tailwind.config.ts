import { isMp } from './platform'

export default {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: {
    preflight: !isMp
  }
}