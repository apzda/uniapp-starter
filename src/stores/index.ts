import { ref } from 'vue'
import { defineStore } from 'pinia'

import { persist } from '@/utils'
const sysInfo = uni.getSystemInfoSync()
export const useAppStore = defineStore(
  'app',
  () => {
    console.debug("SystemInfo: ", sysInfo)
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