import { defineSetting } from '@/@types'

export default defineSetting({
  gtw: {
    default: {
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 60000
    }
  },
  languages: {
    en: {
      name: 'English'
    },
    'zh-CN': {
      name: '中文'
    }
  }
})
