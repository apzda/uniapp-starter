import { createRouter } from 'uni-mini-router'
// 导入pages.json
import pagesJson from '../pages.json'
// 引入uni-parse-pages
import pagesJsonToRoutes from 'uni-parse-pages'
// 生成路由表
const routes = pagesJsonToRoutes(pagesJson)
const router = createRouter({
  routes: [...routes] // 路由表信息
})

router.beforeEach((to, from, next) => {
  // next入参 false 以取消导航
  next()
})

router.afterEach((to, from) => {
})

export default router