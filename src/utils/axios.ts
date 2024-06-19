import type {
  CommonResponse,
  ErrorEvent,
  InternalRequestOptions,
  RejectHandler,
  RequestOptions,
  Response,
  SuccessHandler
} from '@/@types/request'

import type { GtwOptions } from '@/@types'
import setting from '@/config'
import handler from '@/config/handler'
import { isObject } from '@/utils'

// 是否正在刷新
let refreshing: boolean = false

const gateways = (setting.gtw || {}) as { [k: string]: GtwOptions }
const emptyHandler = (event: ErrorEvent) => {
}

export function useAxios(gtw: string = 'default'): RequestProxy {
  const gtwCfg = (gateways[gtw || 'default'] || { baseURL: '/' }) as GtwOptions
  return new RequestProxy(gtwCfg)
}

class RequestProxy {
  private readonly options: RequestOptions
  private readonly debounceMap: Set<string>
  private readonly apiBase: string

  constructor(options: GtwOptions) {
    this.options = options
    this.debounceMap = new Set<string>()
    this.apiBase = options.baseURL
    delete this.options.baseURL
    delete this.options.gtw
  }

  // POST 请求
  post<T = any>(api: string, options?: RequestOptions) {
    options = options || {}
    options.dataType = 'json'
    return this.request<T>(api, 'POST', options)
  }

  // GET 请求
  get<T = any>(api: string, options?: RequestOptions) {
    return this.request<T>(api, 'GET', options)
  }

  // 加密请求
  encrypted<T = any>(api: string, options?: RequestOptions) {
    options = options || {}
    options.header = options.header || {}
    options.header['content-type'] = 'application/encrypted+json'
    options.header['accept'] = 'application/encrypted+json'
    options.dataType = 'text'
    if (typeof options.data != 'undefined') {
      options.data = encrypt(options.data)
    }

    return this.request<T>(api, 'POST', options)
  }

  // 发起查询
  request<T>(api: string, method: 'GET' | 'POST', options: RequestOptions = {}) {
    return new Promise<T>((resolve, reject) => {
      this.doRequest<T>(api, method, options).then(response => {
        //@ts-ignore
        if (options.showErrMsg !== false && (response.errMsg || response.message)) {
          //@ts-ignore
          const errMsg = response.errorMsg || response.message || ''
          if (errMsg) {
            console.info('正常的响应提示:', errMsg)
          }
        }
        resolve(response)
      }).catch(err => {
        //TODO 显示错误提示吧，刷新AccessToken吧
        if (err.errCode == -810) {
          console.error('刷新AccessToken')
        } else {
          const errCode = 'onErr' + Math.abs(err.errCode)
          const errHandler = handler[errCode] || emptyHandler
          const handled = errHandler(err)
          if (options.showErrMsg !== false && (err.errMsg || err.message)) {
            const errMsg = err.errorMsg || err.message || ''
            if (errMsg) {
              console.error('错误的响应提示:', errMsg)
            }
          }

          reject(err)
        }
      })
    })
  }

  private doRequest<T>(api: string, method: 'GET' | 'POST', options?: RequestOptions) {
    return new Promise<T>((resolve, reject) => {
      if (!api || !api.trim()) {
        reject({
          errCode: 400,
          errMsg: 'Missing required parameter "api"'
        })
      }

      options = options || {}
      const gtwCfg = this.options
      for (const cfg in gtwCfg) {
        options[cfg] = gtwCfg[cfg]
      }
      options.timeout = 120000
      const url = this.apiBase + api
      options.url = url
      options.method = method
      if (setting.debounce !== false) {
        if (this.debounceMap.has(url)) {
          const err = {
            errCode: 429,
            errMsg: 'Too many requests'
          }
          reject(err)
          return
        }

        this.debounceMap.add(url)
      }
      const that = this
      //@ts-ignore
      const config = getDefaultOptions(resolve, reject, options)
      //@ts-ignore
      uni.request({
        ...config,
        complete() {
          that.debounceMap.delete(url)
          console.debug('delete url from debounceMap:', url)
        }
      })
    })
  }
}

// 获取默认配置
function getDefaultOptions<T>(resolve: SuccessHandler<T>, reject: RejectHandler, options?: InternalRequestOptions): InternalRequestOptions {
  const config = (options || {}) as InternalRequestOptions
  config.responseType = 'text'

  config.success = (res) => {
    responseHandler<T>(res, resolve, reject)
  }
  config.fail = (err: CommonResponse) => {
    console.error('请求出错: ', err)
    err.errCode = 500
    responseErrorHandler(err, reject)
  }

  return config
}

// 正常响应处理器
function responseHandler<T>(res: Response, resolve: SuccessHandler<T>, reject: RejectHandler) {
  const contentType = res.header['Content-Type'] || res.header['content-type'] || ''

  if (contentType.startsWith('application/encrypted+json')) {
    try {
      // 解密
      res.data = decrypt(res.data)
    } catch (e) {
      reject({ errCode: 1000, errMsg: 'Cannot decrypt data:' + e })
      return
    }
  }

  if (res.statusCode == 200) {
    if (!isObject(res.data)) {
      // 响应格式错误
      reject({
        errCode: -999,
        errMsg: 'Invalid JSON data',
        data: res.data
      })
    } else if (res.data.errCode == 0) {
      // 正常响应
      resolve(res.data)
    } else {
      // 其它错误响应
      res.data.errCode = res.data.errCode || 500
      reject(res.data)
    }
  } else {// 其它类型错误
    if (isObject(res.data) && typeof res.data.errCode != 'undefined') {
      // 其它错误响应
      reject(res.data)
    } else {
      // 网络错误
      reject({
        errCode: res.statusCode,
        errMsg: 'Network Error',
        data: res.data
      })
    }
  }
}

// 错误响应处理器
function responseErrorHandler(err: CommonResponse, reject: RejectHandler) {
  if (err.errMsg?.endsWith('timeout')) {
    err.errCode = 504
  } else {
    // err.errCode = 400
  }
  reject(err)
}

// 解密
function decrypt(data: string) {
  return {}
}

// 加密
function encrypt(data: any): string {
  return 'a'
}