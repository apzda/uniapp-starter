import { defineStore } from 'pinia'

import setting from '@/config'
import { persist } from '@/utils'
import { reactive } from 'vue'

const storagePrefix = setting.storagePrefix || ''

export const useAppStore = defineStore(
  storagePrefix + '::app',
  () => {
    const sysInfo = uni.getSystemInfoSync()

    const app = reactive<Record<string, any>>({
      language: uni.getLocale(),
      theme: sysInfo.theme || 'light'
    })
    const recCode = ref('')
    return {
      app, recCode
    }
  },
  {
    persist
  }
)

export const useSession = defineStore(storagePrefix + '::session', () => {
  const session = reactive<Record<string, any>>({})
  return {
    session
  }
}, {
  persist: {
    storage: {
      getItem(key: string) {
        if (typeof sessionStorage != 'undefined') {
          return sessionStorage.getItem(key)
        }
        return uni.getStorageSync(key)
      },
      setItem(key: string, data: any) {
        if (typeof sessionStorage != 'undefined') {
          return sessionStorage.setItem(key, data)
        }
        uni.setStorage({
          key,
          data,
          success() {
          }
        })
      }
    }
  }
})