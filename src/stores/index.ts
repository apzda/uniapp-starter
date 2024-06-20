import { ref } from 'vue'
import { defineStore } from 'pinia'

import { persist } from '@/utils'

export const useAppStore = defineStore('app', () => {
  const app = ref({
    language: 'en'
  })

  return {
    app
  }
}, {
  persist
})

