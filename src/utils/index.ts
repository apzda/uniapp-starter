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

export const persist = {
  storage: {
    getItem(key: string) {
      return uni.getStorageSync(key)
    },
    setItem(key: string, data: any) {
      uni.setStorage({
        key, data, success() {
        }
      })
    }
  }
}