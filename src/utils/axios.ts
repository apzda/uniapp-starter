import type {
  CommonResponse,
  ErrorEvent,
  IAxios,
  InternalRequestOptions,
  RejectHandler,
  RequestOptions,
  Response,
  SuccessHandler
} from '@/@types/request'

import type { ErrHandlerName, GtwOptions } from '@/@types'
import setting from '@/config'
import handler from '@/config/handlers'
import { deepClone, isObject } from '@/utils'

// 网关配置列表
const gateways = (setting.gtw || {}) as { [k: string]: GtwOptions }
console.log('gateways: ', gateways)
// 默认错误处理器
const emptyHandler = (event: ErrorEvent) => {
  event.suppress = true
  showMessage(event, event.options, false)
}

// 请求代理类
class RequestProxy implements IAxios {
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
  post<T = any>(api: string, options?: RequestOptions): Promise<CommonResponse<T>> {
    options = options || {}
    options.dataType = 'json'
    options.header = options.header || {}
    options.header['Content-Type'] = 'application/json'
    options.header['Accept'] = 'application/json'

    return this.request<T>(api, 'POST', options)
  }

  // GET 请求
  get<T = any>(api: string, options?: RequestOptions): Promise<CommonResponse<T>> {
    return this.request<T>(api, 'GET', options)
  }

  // 加密请求
  encrypted<T = any>(api: string, options?: RequestOptions): Promise<CommonResponse<T>> {
    options = options || {}
    options.header = options.header || {}
    options.header['content-type'] = 'application/encrypted+json'
    options.header['accept'] = 'application/encrypted+json'
    options.dataType = 'text'

    if (typeof options.data != 'undefined') {
      options.data = handler.encrypt(options.data)
    } else {
      options.data = handler.encrypt({})
    }

    return this.request<T>(api, 'POST', options)
  }

  // 发起查询
  request<T = any>(api: string, method: 'GET' | 'POST', options: RequestOptions = {}): Promise<CommonResponse<T>> {
    const that = this
    return new Promise<CommonResponse<T>>((resolve, reject) => {
      this.doRequest<CommonResponse<T>>(api, method, options).then(response => {
        showMessage(response, options, true)
        resolve(response)
      }).catch(err => {
        {
          // redo config ==>
          err.axios = that
          err.options = options
          err.resolve = resolve
          err.reject = reject
          delete err.options.success
          delete err.options.fail
        }
        console.debug('request.failure: ', err)
        const errCode = ('onErr' + Math.abs(err.errCode)) as ErrHandlerName
        const errHandler = handler[errCode] || emptyHandler
        const handled = errHandler(err)
        if (err.suppress !== true) {
          showMessage(err, options, false)
        }
        if (handled !== true) {
          reject(err)
        }
      })
    })
  }

  private doRequest<T>(api: string, method: 'GET' | 'POST', options?: RequestOptions): Promise<T> {
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

      options = handler.beforeRequest(options)
      //@ts-ignore
      const config = getDefaultOptions(resolve, reject, options)
      const that = this
      //@ts-ignore
      uni.request({
        ...config,
        complete() {
          that.debounceMap.delete(url)
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
      res.data = handler.decrypt(res.data)
    } catch (e) {
      reject({ errCode: 1000, errMsg: 'Cannot decrypt data:' + e })
      return
    }
  }

  if (res.statusCode == 200) {
    if (handler.transformResponse) {
      res.data = handler.transformResponse(res.data)
    }
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
    if (handler.transformResponse) {
      res.data = handler.transformResponse(res.data)
    }
    if (isObject(res.data) && res.data.errCode != undefined) {
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
  }
  reject(err)
}

// 提示
function showMessage(response: any, options: RequestOptions, success: boolean) {
  if (options.showErrMsg !== false && (response.errMsg || response.message)) {
    const errMsg = response.errMsg || response.message || ''
    const msgType = ((response.type || 'toast') as string).toLowerCase()
    if (msgType != 'none' && errMsg) {
      handler.showTipMessage(success, msgType, errMsg)
    }
  }
}

// 入口
export function useAxios(gtw: string = 'default'): RequestProxy {
  const gtwCfg = (gateways[gtw || 'default'] || { baseURL: '/' }) as GtwOptions
  return new RequestProxy(deepClone(gtwCfg))
}