import { defineSetting } from '@/@types'

export default defineSetting({
  gtw: {
    default: {
      base: import.meta.env.VITE_API_URL
    }
  }
})