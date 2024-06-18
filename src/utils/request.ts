import type {
  CommonResponse,
  InternalRequestOptions,
  RejectHandler,
  RequestOptions,
  Response,
  SuccessHandler
} from '@/@types/request'
import type { GtwOptions } from '@/@types'
import setting from '@/config'


const gateways = (setting.gtw || {}) as { [k: string]: GtwOptions }

// POST 请求
export function post<T = any>(api: string, options?: RequestOptions) {
  options = options || {}
  options.dataType = 'json'
  return doRequest<T>(api, 'POST', options)
}

// GET 请求
export function get<T = any>(api: string, options?: RequestOptions) {
  return doRequest<T>(api, 'GET', options)
}

// 加密请求
export function encrypted<T = any>(api: string, options?: RequestOptions) {
  options = options || {}
  options.header = options.header || {}
  options.header['content-type'] = 'application/encrypted+json'
  options.header['accept'] = 'application/encrypted+json'
  options.dataType = 'text'
  if (typeof options.data != 'undefined') {
    options.data = encrypt(options.data)
  }

  return doRequest<T>(api, 'POST', options)
}

// 发起查询
function doRequest<T>(api: string, method: 'GET' | 'POST', options?: RequestOptions) {
  return new Promise<T>((resolve, reject) => {
    if (!api || !api.trim()) {
      reject(new Error(`Missing required parameter "api"`))
    }
    options = options || {}
    const gtwCfg = (gateways[options.gtw || 'default'] || { base: '/' }) as GtwOptions
    const apiBase = gtwCfg.base
    for (const cfg in gtwCfg) {
      options[cfg] = gtwCfg[cfg]
      console.log(cfg, '=', gtwCfg[cfg])
    }
    delete options.gtw
    delete options.base

    options.url = apiBase + api
    options.method = method

    //@ts-ignore
    const config = getDefaultOptions(resolve, reject, options)
    console.log('options ======>')
    console.log(options)
    console.log(' <========= options, gwtCfg ==========>')
    console.log(gtwCfg)
    console.log(' <============ ')
    //@ts-ignore
    uni.request(config)
  })
}

// 获取默认配置
function getDefaultOptions<T>(resolve: SuccessHandler<T>, reject: RejectHandler, options?: InternalRequestOptions): InternalRequestOptions {
  const config = (options || {}) as InternalRequestOptions
  config.responseType = 'text'

  config.success = (res) => {
    responseHandler<T>(res, resolve, reject, config)
  }
  config.fail = (err: CommonResponse) => {
    err.errCode = 1
    responseErrorHandler(err, reject, config)
  }
  config.complete = () => {
    handleComplete(config)
  }

  return config
}

// 正常响应处理器
function responseHandler<T>(res: Response, resolve: SuccessHandler<T>, reject: RejectHandler, config: InternalRequestOptions) {

  const contentType = res.header['Content-Type'] || res.header['content-type'] || ''

  if (contentType.startsWith('application/encrypted+json')) {
    try {
      res.data = decrypt(res.data)
    } catch (e) {
      reject({ errCode: 1, errMsg: e + '' })
      return
    }
  }

  if (res.statusCode == 200) {
    resolve(res.data)
  } else {
    reject({
      errCode: 1
    })
  }
}

// 错误响应处理器
function responseErrorHandler(err: CommonResponse, reject: RejectHandler, config: InternalRequestOptions) {
  console.error('err =>', err, 'config =>', config)
  reject(err)
}

// 请求完成
function handleComplete(config: InternalRequestOptions) {
  // console.log('handleComplete', config)
}

// 解密
function decrypt(data: string) {
  return {}
}

// 加密
function encrypt(data: any): string {
  return ''
}