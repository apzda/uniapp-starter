import accounting from 'accounting'

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

const pad = (num: string | number) => String(num).padStart(2, '0')

export const formatDate = (date: Date, format = 'yyyy-MM-dd'): string => {
  const tokens: { [format: string]: string } = {
    'yyyy': date.getFullYear().toString(),
    'MM': pad(date.getMonth() + 1),
    'dd': pad(date.getDate()),
    'HH': pad(date.getHours()),
    'mm': pad(date.getMinutes()),
    'ss': pad(date.getSeconds())
  }

  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => tokens[match])
}

export const formatDatetime = (date: Date, format = 'yyyy-MM-dd HH:mm:ss'): string => {
  return formatDate(date, format)
}

export const fromUnixTimestamp = (timestamp: number | string, format = 'yyyy-MM-dd HH:mm:ss'): string => {
  if (!timestamp) {
    return ''
  }

  const d = new Date()
  if (timestamp.toString().length > 12) {
    d.setTime(timestamp as number)
  } else {
    d.setTime(timestamp as number * 1000)
  }

  return formatDate(d, format)
}
export const formatMoney = (value?: number | string | null, scale: number = 2) => {
  return accounting.formatMoney(value || 0, '￥', scale)
}
export const formatNumber = (value: number, precision: number = 0) => {
  return accounting.formatNumber(value || 0, precision)
}
export const formatNumStr = (value: number, precision: number = 2, passive: string = '⭡', negative = '⭣') => {
  return accounting.formatMoney(Math.abs(value || 0), (value || 0) >= 0 ? passive : negative, precision)
}

export const mergeDeep = (o1: Record<string, any>, o2: Record<string, any>): Record<string, any> => {
  for (const key in o2) {
    if (typeof o2[key] === 'object') {
      if (o2[key] instanceof Array) {
        for (let i = 0; i < o2[key].length; i++) {
          o1[key][i] = mergeDeep(o1[key][i] || {}, o2[key][i])
        }
      } else {
        o1[key] = mergeDeep(o1[key], o2[key])
      }
    } else {
      o1[key] = o2[key]
    }
  }
  return o1
}

export function deepClone(source: any, hash = new WeakMap()) {
  if (typeof source !== 'object' || source === null) {
    return source
  }
  if (hash.has(source)) {
    return hash.get(source)
  }
  const target = Array.isArray(source) ? [] : {}
  Reflect.ownKeys(source).forEach((key) => {
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

export const persist = {
  storage: {
    getItem(key: string) {
      return uni.getStorageSync(key)
    },
    setItem(key: string, data: any) {
      uni.setStorage({
        key,
        data,
        success() {
        }
      })
    }
  }
}

export const buildFromParam = (url?: string, query?: Record<string, any>) => {
  let path = url || '/'
  if (query) {
    const queryString = Object.keys(query)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(query[key] || ''))
      .join('&')
    if (queryString) {
      path = path + (path.indexOf('?') > 0 ? '' : '?') + queryString
    }
  }
  return path.startsWith('/') ? path : '/' + path
}

export const getCurrentPage = (): {
  route?: string
  $vm?: any
} => {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}