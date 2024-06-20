import { nextTick } from 'vue'
import { createI18n, type I18n, type I18nOptions } from 'vue-i18n'
import { merge } from 'lodash-es'

import settings from '@/config'
import { useAppStore } from '@/stores'

export interface Msg {
  [key: string]: string | number | Msg
}

const gp = /^\/.+\/(.+)\.json$/

export function loadMessages(messages: Msg) {
  const msgs: Msg = {}
  const paths = Object.keys(messages).sort((a, b) => {
    const af = a.replace(gp, '$1')
    const bf = b.replace(gp, '$1')
    return af === bf ? (a > b ? 1 : -1) : af > bf ? 1 : -1
  })

  for (const path of paths) {
    merge(msgs, messages[path])
  }

  return msgs
}

export const SUPPORT_LOCALES: string[] = Object.keys(settings.languages || {})


const languages = import.meta.glob('../lang/*.ts', { import: 'default', eager: true })

console.log(languages)
for (const path in languages) {
  //@ts-ignore

}

let defaultLang: string = settings.language || 'en'
console.debug('Supported Languages:', SUPPORT_LOCALES)

if (!SUPPORT_LOCALES.includes(defaultLang)) {
  defaultLang = defaultLang.substring(0, 2)
  if (!SUPPORT_LOCALES.includes(defaultLang)) {
    defaultLang = 'en'
  }
}

type _I18n = I18n<{}, {}, {}, string, false>

const instance: {
  i18n?: _I18n
} = {}

export function setupI18n(options: I18nOptions) {
  settings.language = defaultLang
  const i18n = createI18n(options) as _I18n
  instance.i18n = i18n
  setI18nLanguage(i18n, options.locale as string)
  console.error('I18N setup done')
  return i18n
}

export function setI18nLanguage(i18n: _I18n, locale: string) {
  const { app } = useAppStore()
  app.language = locale
}

export async function loadLocaleMessages(i18n: _I18n, locale: string, callback?: () => void) {
  // load locale messages with dynamic import
  const messages = await import(`../lang/${locale}.ts`)
  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)
  i18n.global.locale.value = locale
  console.debug('Language files loaded: ', locale)

  return nextTick(() => {
    if (typeof callback == 'function') {
      callback()
    }
    setI18nLanguage(i18n, locale)
  })
}

export function t(msg: string, args?: any) {
  return instance.i18n?.global.t(msg, args)
}

export function ts(message: string, defaultString: string, args?: any) {
  const text = t(message, args)
  if (text == message) {
    return defaultString
  }
  return text
}