import { defineStore } from 'pinia'

import setting from '@/config'
import { persist } from '@/utils'
import { reactive } from 'vue'
import theme from '@/theme.json'

const storagePrefix = setting.storagePrefix || ''

export const useAppStore = defineStore(
  storagePrefix + '::app',
  () => {
    const sysInfo = uni.getSystemInfoSync()

    const app = reactive<Record<string, any>>({
      language: uni.getLocale(),
      theme: sysInfo.theme || 'light'
    })
    const themeCfg = theme as Record<string, Record<string, string>>

    const recCode = ref('')

    const getSysInfo = () => sysInfo

    const setupTheme = (theme?: string) => {
      theme = (theme || app.theme) as string
      uni.setBackgroundColor({
        backgroundColor: themeCfg[theme]?.backgroundColor,
        backgroundColorTop: themeCfg[theme]?.backgroundColorTop,
        backgroundColorBottom: themeCfg[theme]?.backgroundColorBottom
      })
      uni.setNavigationBarColor({
        backgroundColor: themeCfg[theme]?.navBgColor,
        frontColor: theme == 'dark' ? '#ffffff' : '#000000'
      })
    }
    // #ifndef H5
    watchEffect(() => {
      setupTheme(app.theme)
    })
    // #endif

    return {
      app, recCode, getSysInfo, setupTheme
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