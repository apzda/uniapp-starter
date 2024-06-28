import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import uvUI from '@climblee/uv-ui'

import { getLanguage, getLocale, setupI18n } from '@/utils/i18n'
import '@/uni.scss'
import '@/styles/index.scss'
import App from '@/App.vue'

// setup pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// setup language messages
const messages: Record<string, any> = {}
const languages = import.meta.glob('./lang/*.ts', { import: 'default', eager: true })
for (const path in languages) {
  const lang = getLocale(path)
  // console.debug(lang, ' => ', languages[path])
  messages[lang] = languages[path]
}

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uvUI)

  // install plugins
  const plugins = import.meta.glob('./**/plugins/*.ts', { import: 'default', eager: true })
  for (const path in plugins) {
    //@ts-ignore
    app.use(plugins[path])
  }

  // setup i18n
  const i18n = setupI18n({
    legacy: false,
    locale: getLanguage(),
    messages: messages,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    missingWarn: false
  })
  app.use(i18n)
  // console.debug('i18n hello => ', i18n.global.t('hello'))

  return {
    app
  }
}