import type { DirectiveBinding, Plugin } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
  install(app) {
    const { userInfo, isSuperAdmin, hasRole, hasAuthority, hasPermission } = useUserStore()

    app.config.globalProperties.$isSuperAdmin = isSuperAdmin
    app.config.globalProperties.$hasRole = hasRole
    app.config.globalProperties.$hasAuthority = hasAuthority
    app.config.globalProperties.$hasPermission = hasPermission
    app.config.globalProperties.$isUser = () => userInfo.login
    app.config.globalProperties.$isLogin = () => userInfo.login

    app.directive('is-super-admin', (el: HTMLElement) => {
      if (!isSuperAdmin()) {
        el.parentNode?.removeChild(el)
      }
    })

    app.directive('super-admin', (el: HTMLElement) => {
      if (!isSuperAdmin()) {
        el.parentNode?.removeChild(el)
      }
    })

    app.directive('has-role', (el: HTMLElement, binding: DirectiveBinding) => {
      console.debug('v-has-role binding:', binding)
      if (!hasRole(binding.value, binding.modifiers)) {
        el.parentNode?.removeChild(el)
      }
    })

    app.directive('has-authority', (el: HTMLElement, binding: DirectiveBinding) => {
      if (!hasAuthority(binding.value, binding.modifiers)) {
        el.parentNode?.removeChild(el)
      }
    })

    app.directive('has-permission', (el: HTMLElement, binding: DirectiveBinding) => {
      if (!hasPermission(binding.value, binding.arg ? { id: binding.arg } : {})) {
        el.parentNode?.removeChild(el)
      }
    })

    console.debug('auth plugin installed')
  }
} as Plugin
