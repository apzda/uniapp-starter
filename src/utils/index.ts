// 合并axios配置
import type { GtwOptions } from '@/@types'

export const mergeCfg = (cfg: string | GtwOptions, transformResponse?: ((data: any) => any) | ((data: any) => any)[]) => {
  if (typeof cfg === 'string') {
    cfg = { baseURL: cfg }
  }

  if (cfg.transformResponse) {
    cfg.transformResponse = toArray(cfg.transformResponse)
  } else {
    cfg.transformResponse = []
  }

  if (transformResponse) {
    const items = toArray(transformResponse)
    for (let i = 0; i < items.length; i++) {
      cfg.transformResponse.push(items[i])
    }
  }

  if (cfg.transformResponse.length == 0) {
    delete cfg.transformResponse
  }

  return cfg
}


export const toArray = <T>(args: T | T[]): T[] => {
  if (Array.isArray(args)) {
    return args
  } else {
    return [args]
  }
}

export const isObject = (data: any) => {
  return typeof data == 'object' && !Array.isArray(data)
}

export function deepClone(source: any, hash = new WeakMap()) {
  if (typeof source !== 'object' || source === null) {
    return source
  }
  if (hash.has(source)) {
    return hash.get(source)
  }
  const target = Array.isArray(source) ? [] : {}
  Reflect.ownKeys(source).forEach(key => {
    const val = source[key]
    if (typeof val === 'object' && val !== null) {
      //@ts-ignore
      target[key] = deepClone(val, hash)
    } else {
      //@ts-ignore
      target[key] = val
    }
  })
  hash.set(source, target)
  return target
}