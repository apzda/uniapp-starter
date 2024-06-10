const { isMp } = require('./platform')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: !isMp
  }
}