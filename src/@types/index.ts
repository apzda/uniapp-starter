// 网关选项
export interface GtwOptions {
  [key: string]: any

  base: string
  timeout?: number
  withCredentials?: boolean
  responseType?: 'arraybuffer' | 'text'
  enableHttp2?: boolean
  enableQuic?: boolean
  enableChunked?: boolean
  defer?: boolean
  header?: {
    [h: string]: string
  }
}

// 配置选项
export interface Settings {
  [index: string]: any

  loginPage?: string // 登录地址
  resetPwdPage?: string // 重置密码地址
  registerPage?: string // 注册地址
  logoutApi?: string // 退出接口
  refreshTokenApi?: string // 刷新TOKEN接口
  rolePrefix?: string
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

// 网络请求错误处理器
export interface Handlers {
  [event: string]: (event: ErrorEvent) => boolean | void

  onLogin: (event: ErrorEvent) => void
  onResetPassword: (event: ErrorEvent) => void
  onRequestTooFast: (event: ErrorEvent) => void
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

