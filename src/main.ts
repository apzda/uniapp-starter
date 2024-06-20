import { createSSRApp, readonly, ref } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { setupI18n } from '@/utils/i18n'
import { LANGUAGE_LOAD_KEY } from '@/@types'
import { useAppStore } from '@/stores'
import '@/uni.scss'
import '@/styles/index.scss'
import App from '@/App.vue'


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)

  // install plugins
  const plugins = import.meta.glob('./**/plugins/*.ts', { import: 'default', eager: true })
  for (const path in plugins) {
    //@ts-ignore
    app.use(plugins[path])
  }

  const appInfo = useAppStore()
  const i18n = setupI18n({
    legacy: false,
    locale: appInfo.app.language,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    silentFallbackWarn: true
  })

  app.use(i18n)

  const languageLoaded = ref(false)
  app.provide(LANGUAGE_LOAD_KEY, readonly(languageLoaded))

  return {
    app
  }
}