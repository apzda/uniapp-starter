import { ref } from 'vue'
import { defineStore } from 'pinia'

import { persist } from '@/utils'

export const useAppStore = defineStore(
  'app',
  () => {
    const sysInfo = uni.getSystemInfoSync()
    console.debug('SystemInfo: ', sysInfo)
    const app = ref({
      language: uni.getLocale(),
      theme: sysInfo.theme || 'light'
    })

    return {
      app
    }
  },
  {
    persist
  }
)