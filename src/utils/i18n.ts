import { createI18n, type I18n, type I18nOptions } from 'vue-i18n'
import merge from 'deepmerge'

import settings from '@/config'
import { useAppStore } from '@/stores'

export interface Msg {
  [key : string] : string | number | Msg
}

const gp = /^\/.+\/(.+)\.json$/

export const SUPPORT_LOCALES : string[] = Object.keys(settings.languages || {})
console.debug('Supported Languages:', SUPPORT_LOCALES)

let defaultLang : string = settings.language || uni.getLocale() || 'en'

if (!SUPPORT_LOCALES.includes(defaultLang)) {
  defaultLang = defaultLang.substring(0, 2)
  if (!SUPPORT_LOCALES.includes(defaultLang)) {
    defaultLang = 'en'
  }
}

export const defaultLocale = defaultLang
console.debug('default language: ', defaultLocale)

type _I18n = I18n<{}, {}, {}, string, false>

const instance : {
  i18n ?: _I18n
} = {}

export function setupI18n(options : I18nOptions) {
  const i18n = createI18n(options) as _I18n
  instance.i18n = i18n

  return i18n
}

export function getLanguage() {
  const { app } = useAppStore()
  if (!app.language) {
    app.language = defaultLocale
  }
  return app.language
}

export function setLanguage(locale : string) {
  const { app } = useAppStore()
  app.language = locale
  if (instance.i18n != undefined) {
    instance.i18n.global.locale.value = locale
  }
}

export function t(msg : string, args ?: any) {
  if (!instance.i18n) {
    return msg
  }
  return instance.i18n.global.t(msg, args)
}

export function ts(message : string, defaultString : string, args ?: any) {
  const text = t(message, args)
  if (text == message) {
    return defaultString
  }
  return text
}

export function loadMessages(messages : Msg) {
  let msgs : any = {}
  const paths = Object.keys(messages).sort((a, b) => {
    const af = a.replace(gp, '$1')
    const bf = b.replace(gp, '$1')
    return af === bf ? (a > b ? 1 : -1) : af > bf ? 1 : -1
  })

  for (const path of paths) {
    msgs = merge.all([messages[path], msgs])
  }

  return msgs
}
// 根据文件名获取语言名
export function getLocale(path : string) : string {
  const match = /.+\/([^\\.]+)\.ts$/.exec(path)
  if (match) {
    return match[1]
  } else {
    return 'en'
  }
}