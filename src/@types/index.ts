import type { CommonResponse, ErrorEvent, RequestOptions } from './request'

// 网关选项
export interface GtwOptions {
  [key: string]: any

  baseURL: string
  timeout?: number
  withCredentials?: boolean
  responseType?: 'arraybuffer' | 'text'
  enableHttp2?: boolean
  enableQuic?: boolean
  enableChunked?: boolean
  transformResponse?: ((data: any) => any) | ((data: any) => any)[]
  defer?: boolean
  header?: {
    [h: string]: string
  }
}

// 配置选项
export interface Settings {
  [index: string]: any

  loginPage?: string // 登录地址
  landingPage?: string// 注册成功后的落地页面
  resetPwdPage?: string // 重置密码地址
  registerPage?: string // 注册地址
  logoutApi?: string // 退出接口
  refreshTokenApi?: string // 刷新TOKEN接口
  rolePrefix?: string
  storagePrefix?: string
  simulator?: string
  tokenHeaderName?: string
  tokenBearer?: string
  whiteList?: string[]
  gtw?: {
    [gtw: string]: GtwOptions

    default: GtwOptions
  }
  debounce?: boolean
  language?: string
  languages?: {
    [lang: string]: {
      name: string
      flag?: string
    }
  }
}

export type ErrHandlerName = `on${string}`

// 网络请求错误处理器
export interface Handlers {
  [event: ErrHandlerName]: (event: ErrorEvent) => boolean | void

  transformResponse?: ((data: any) => CommonResponse)

  encrypt(data: any): string

  decrypt(data: string): CommonResponse

  showTipMessage(success: boolean, type: string, message: string): void

  beforeRequest(options: RequestOptions): RequestOptions
}

export const defineSetting = (settings: Settings): Settings => {
  settings.whiteList = settings.whiteList || []

  for (const key in settings) {
    if (key.endsWith('Page')) {
      settings.whiteList.push(settings[key])
    }
  }

  return settings
}

export const defineHandler = (handlers: Handlers): Handlers => handlers

// 表单选项
export interface FormItemOpt {
  message?: string
  status?: '' | 'error' | 'validating' | 'success',
  placeholder?: string,
  label?: string
}

// 表单配置
export type FormOptions<T extends Record<string, any>> = {
  [key in keyof T]: FormItemOpt
}

// 表单数据模型
export type FormModel<T extends Record<string, any>> = {
  [key in keyof T]: T[key]
}

type triggerType = 'blur' | 'change' | 'submit'
export type FormRules<T extends Record<string, any>> = {
  [key in keyof T]?: {
    type?: 'array' | 'string' | 'number'
    pattern?: RegExp
    required?: boolean
    message?: string | (() => string)
    trigger?: triggerType | triggerType[]
    transform?: (value: T[key]) => any
    validator?: (rule: string, value: any, callback: ((errors?: Error | Error[] | string) => Error | Error[])) => any
    asyncValidator?: (rule: string, value: T[key]) => Promise<string>

    [index: string]: any
  }[]
}
