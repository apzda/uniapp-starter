import { useUserStore } from '@/stores/user'
import { createRouter, type Route } from 'uni-mini-router'
import setting from '@/config'
// 导入pages.json
import pagesJson from '../pages.json'
// 引入uni-parse-pages
import pagesJsonToRoutes from 'uni-parse-pages'
import { buildFromParam } from '@/utils'
// 生成路由表
const routes = pagesJsonToRoutes(pagesJson)
// 创建路由器
const router = createRouter({
  routes: [...routes] // 路由表信息
})

router.beforeEach((to, from, next) => {
  // next入参 false 以取消导航
  const userStore = useUserStore()
  //@ts-ignore
  if (to.meta?.login && !userStore.isLogin()) {
    if (setting.loginPage) {
      next({
        path: setting.loginPage,
        query: {
          from: buildUrl(to)
        }
      })
    } else {
      uni.showToast({
        title: '用户未登录',
        icon: 'none'
      }).then()
      //@ts-ignore
      next(from)
    }
  } else {
    next()
  }
})

const buildUrl = (to: Route): string => {
  const path = to.path || '/'
  return buildFromParam(path, to.query || {})
}

export default router