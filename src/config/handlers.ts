import { defineHandler } from '@/@types'
import type { CommonResponse, ErrorEvent, RequestOptions } from '@/@types/request'
import { type UserInfo, useUserStore } from '@/stores/user'
import { buildFromParam, getCurrentPage } from '@/utils'
import { useAxios } from '@/utils/axios'
import setting from '@/config'

const axios = useAxios()
const defaultReject = () => {
}
const defaultResolve = () => {
}

let refreshing = false

const refreshFailed = (event: ErrorEvent, userInfo: UserInfo) => {
  userInfo.login = false
  userInfo.accessToken = undefined
  userInfo.refreshToken = undefined
  if (setting.loginPage) {
    // 去登录页
    uni.redirectTo({
      url: buildFromParam(setting.loginPage, {
        from: buildFromParam(getCurrentPage().route)
      })
    }).then()
  } else if (event.reject) {
    // 直接拒绝
    event.reject(event)
  }
}

const refreshAccessToken = (event: ErrorEvent) => {
  const { userInfo, refresh } = useUserStore()
  const options = event.options
  const rejectFunc = event.reject || defaultReject
  const resolveFunc = event.resolve || defaultResolve
  event.reject = rejectFunc
  if (!setting.refreshTokenApi || !userInfo.accessToken || !userInfo.refreshToken) {
    refreshFailed(event, userInfo)
    return
  }

  if (refreshing) {
    // 防抖处理（每隔100ms重试）
    console.debug('等待accessToken刷新: ', event.options?.url)
    const timer = setInterval(() => {
      if (userInfo.refreshToken) {
        if (!refreshing) {
          clearInterval(timer)
          // accessToken刷新完成, 重放请求
          console.debug('重放等待请求: ', event.options?.url, event.options)
          axios.request(options?.url || '', options?.method || 'POST', options).then(resolveFunc).catch(rejectFunc)
        } else {
          // 此时刷新还没有完成，需要等待
          console.debug('accessToken刷新未完成，等待...', event.options?.url)
        }
      } else {
        clearInterval(timer)
        // 刷新accessToken失败了, 此时应该已经跳转到登录页了
        console.warn('等待accessToken刷新失败, 停止等待: ', event.options?.url)
        refreshFailed(event, userInfo)
      }
    }, 100)
  } else {
    refreshing = true
    console.debug('开始accessToken刷新: ', event.options?.url)
    axios.doRequest<UserInfo>(setting.refreshTokenApi, 'POST', {
      data: {
        name: userInfo.name,
        accessToken: userInfo.accessToken,
        refreshToken: userInfo.refreshToken
      },
      login: false
    }).then(({ data }) => {
      console.debug('accessToken刷新成功', event.options?.url)
      if (refresh(data)) {
        console.debug('重放请求:', options?.url, options)
        axios.request(options?.url || '', options?.method || 'POST', options).then(resolveFunc).catch(rejectFunc)
      }
    }).catch(err => {
      refreshFailed(err, userInfo)
    }).finally(() => {
      refreshing = false
    })
  }
}

export function refreshToken(callback?: (user?: UserInfo) => void) {
  const { userInfo, refresh } = useUserStore()
  if ((!userInfo.accessToken || !userInfo.refreshToken) && callback) {
    callback()
  }

  if (setting.refreshTokenApi) {
    axios.doRequest<UserInfo>(setting.refreshTokenApi, 'POST', {
      data: {
        name: userInfo.name,
        accessToken: userInfo.accessToken,
        refreshToken: userInfo.refreshToken
      },
      login: false
    }).then(({ data }) => {
      if (refresh(data) && callback) {
        callback(data)
      } else if (callback) {
        callback(data)
      }
    })
  } else if (callback) {
    callback()
  }
}

export default defineHandler({
  beforeRequest(options: RequestOptions): RequestOptions {
    const { uuid, userInfo } = useUserStore()
    options.header = options.header || {}

    options.header.uuid = uuid || ''

    if (options.login !== false && userInfo.login && userInfo.accessToken && setting.tokenHeaderName) {
      options.header[setting.tokenHeaderName] = ((setting.tokenBearer || '') + ' ' + (userInfo.accessToken || '')).trim()
    }

    if (!options.header['accept'] || !options.header['Accept']) {
      options.header['Accept'] = 'application/json'
    }

    if (options.header['Accept'] === 'application/json' && !options.data) {
      options.data = {}
    }

    if (options.method?.toLowerCase() == 'get') {
      delete options.data._t
      options.data = {
        ...options.data,
        _t: new Date().getTime()
      }
    }

    return options
  },
  showTipMessage(success: boolean, type, message: string) {
    const options: UniApp.ShowToastOptions = {}

    options.title = message
    options.duration = 3000
    if (success) {
      options.icon = 'none'
      options.mask = false
    } else {
      options.icon = 'none'
      options.mask = true
    }

    return uni.showToast(options)
  },
  encrypt(data: any): string {
    throw new Error('encrypt not implemented: ' + data)
  },
  decrypt(data: string): CommonResponse {
    throw new Error('decrypt not implemented: ' + data)
  },
  onErr401(event) {
    event.suppress = false
    if (setting.loginPage) {
      const page = getCurrentPage()
      uni.redirectTo({
        url: buildFromParam(setting.loginPage, {
          from: buildFromParam(page.route)
        })
      }).then()
    }
  },
  onErr811(event) {
    event.suppress = false
    const { userInfo } = useUserStore()
    userInfo.login = false
    if (setting.loginPage) {
      const page = getCurrentPage()
      uni.redirectTo({
        url: buildFromParam(setting.loginPage, {
          from: buildFromParam(page?.route)
        })
      }).then()
    }
  },
  onErr810(event) {
    event.suppress = true
    refreshAccessToken(event)
    return true
  }
})

