import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { RoutePathLocation } from 'uni-mini-router'
import setting from '@/config'

import { buildFromParam, getCurrentPage, isObject, persist, toArray } from '@/utils'
import { generateUUID } from '@/utils/crypto'
import handlers from '@/config/handlers'
import { useAxios } from '@/utils/axios'

export interface Job {
  id: string
  name: string
  title: string
  level: number
  icon?: string
  current?: true
}

export interface Department {
  id: string
  name: string
  desc?: string
  icon?: string
  current?: true
  jobs?: { [id: string]: Job }
}

export interface Organization {
  id: string
  name: string
  desc?: string
  icon?: string
  current?: true
  departments?: { [id: string]: Department }
}

export interface Tenant {
  id: string
  name: string
  current?: true
  organizations?: { [id: string]: Organization }
}

export interface Role {
  id: string
  name: string
  role: string
}

export interface UserInfo {
  [key: string]: any

  uid?: string | number
  uuid?: string
  name?: string
  displayName?: string
  firstName?: string
  lastName?: string
  status?: string
  login?: boolean
  lastLoginTime?: number
  lastLoginIp?: string
  phone?: string
  phonePrefix?: string
  email?: string
  provider?: string
  avatar?: string
  timezone?: string
  theme?: string
  lang?: string
  accessToken?: string
  refreshToken?: string
  mfa?: string
  locked?: boolean
  credentialsExpired?: boolean
  runAs?: string
  authorities?: string[]
  roles?: Role[]
  tenants?: { [id: string]: Tenant }
  tenant?: Tenant
  organization?: Organization
  department?: Department
  job?: Job
}

const ROLE_PREFIX = setting.rolePrefix || 'ROLE_'
const storagePrefix = setting.storagePrefix || ''
const patterns = new Map<string, RegExp>()

const getPattern = (authority: string): RegExp | undefined => {
  if (patterns.has(authority)) {
    return patterns.get(authority)
  }
  let suffix = false,
    key = authority
  if (key.endsWith('.*')) {
    key = key.substring(0, key.length - 2)
    suffix = true
  }
  key = key
    .replaceAll(/([a-z0-9_-]+)(,[a-z0-9_-]+)+/gi, (m) => {
      return '(' + m.replaceAll(',', '|') + ')'
    })
    .replaceAll('.', '\\.')
    .replaceAll('*', '(.+?)')
  if (suffix) {
    key += '.*'
  }
  // console.debug('pattern:', authority, ' => ', key)
  patterns.set(authority, new RegExp('^' + key + '$'))
  return patterns.get(authority)
}

export const useUserStore = defineStore(storagePrefix + '::userStore', () => {
  const userInfo = ref<UserInfo>({})
  const uuid = ref<string>(generateUUID())
  const logout = () => {
    if (userInfo.value && userInfo.value.login) {

      if (setting.logoutApi) {
        const axios = useAxios()
        axios.post(setting.logoutApi).then(() => {
          uni.showToast({
            title: '已退出',
            icon: 'none'
          }).then()
        }).finally(() => {
          userInfo.value = {}
          uni.redirectTo({
            url: '/'
          }).then()
        })
      } else {
        userInfo.value = {}
        uni.redirectTo({
          url: '/'
        }).then()
      }
    }
  }
  const login = (data: UserInfo, redirect?: string) => {
    if (refresh(data)) {
      uni.redirectTo({
        url: redirect || '/'
      }).then()
    }
  }

  const refresh = (data: UserInfo) => {
    data.login = true
    userInfo.value = data
    if (!data.uid || data.uid == 0) {
      if (typeof handlers['onErr808'] === 'function') {
        handlers['onErr808']({ errCode: 808 })
      } else {
        uni.showToast({
          title: '请绑定平台账户',
          icon: 'none'
        }).finally(() => {
        })
      }
      return false
    }
    return true
  }

  const isLogin = (): boolean => {
    return !!userInfo.value?.login
  }

  const isSuperAdmin = (): boolean => {
    return hasRole('sa')
  }

  const hasRole = (roles: string | string[], modifiers: Record<string, boolean> = {}): boolean => {
    //console.debug('hasRole', roles, modifiers)
    if (!userInfo.value.login || !userInfo.value.authorities) {
      return false
    }
    const toBeChecked = toArray(roles).map((r) => ROLE_PREFIX + r)
    return hasAuthority(toBeChecked, modifiers)
  }

  const hasAuthority = (authorities: string | string[], modifiers: Record<string, boolean> = {}): boolean => {
    // console.debug('hasAuthority', authorities, modifiers)
    if (!userInfo.value.login || !userInfo.value.authorities) {
      return false
    }
    const toBeChecked = toArray(authorities)
    const matched = toBeChecked.filter((r) => {
      return userInfo.value.authorities?.includes(r)
    })

    if (modifiers['and']) {
      return matched.length > 0 && matched.length == toBeChecked.length
    }

    return matched.length > 0
  }

  const hasPermission = (
    permission: string,
    args?: { id?: string | number; [key: string]: any } | (() => string)
  ): boolean => {
    // console.debug('hasPermission: ', permission, ', args =>', args)
    if (!userInfo.value.login || !userInfo.value.authorities) {
      return false
    }
    let id = permission
    if (args) {
      if (typeof args == 'function') {
        id += '.' + args()
      } else {
        id += '.' + args.id
      }
    }

    if (hasAuthority(id)) {
      return true
    }

    // console.debug('Real permission to check:', id)
    const authority = userInfo.value.authorities
      .filter((a) => a.indexOf('*') >= 0)
      .find((authority) => {
        const pattern = getPattern(authority)
        return pattern && pattern.test(id)
      })
    // console.debug('matched =>', authority)
    return authority != undefined
  }

  const checkLogin = (from?: string | RoutePathLocation, to?: string) => {
    if (isLogin()) {
      if (to) {
        //@ts-ignore
        uni.navigateTo({
          url: buildFromParam(to)
        }).then()
      }
    } else {
      const query = {
        from: '/'
      }
      if (from) {
        if (typeof from === 'string') {
          query.from = buildFromParam(from)
        } else if (isObject(from)) {
          query.from = buildFromParam(from.path || '/', from.query)
        }
      }
      const url = buildFromParam(setting.loginPage, query)
      // 使用redirectTo会报错????
      uni.navigateTo({ url }).then()
    }
  }

  const assertUserIsAuthenticated = checkLogin

  return {
    userInfo,
    uuid,
    isSuperAdmin,
    hasPermission,
    hasAuthority,
    hasRole,
    isLogin,
    login,
    checkLogin,
    assertUserIsAuthenticated,
    refresh,
    logout
  }

}, {
  persist
})

export const assertUserIsAuthenticated = () => {
  const cp = getCurrentPage()
  useUserStore().assertUserIsAuthenticated(cp?.route || setting.landingPage || '/')
}

