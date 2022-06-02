import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tools',
    name: 'Tools',
    meta: { title: 'Tools' },
    component: () => import('@/views/Tools/index.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Tools/Home/index.vue')
      },
      {
        path: 'files',
        meta: { title: '文件管理' },
        component: () => import('@/views/Tools/Files/index.vue')
      },
      {
        path: 'gamerecord/:id?',
        component: () => import('@/views/Tool.GameRecord.vue')
      },
      {
        path: 'deemo',
        meta: { title: 'Deemo练习记录' },
        component: () => import('@/views/Tools/Deemo/Tool.Deemo.vue')
      },
    ]
  },
  {
    path: '/account',
    name: 'Account',
    meta: { title: '用户中心' },
    component: () => import('@/views/Account/index.vue'),
    children: [
      {
        path: 'timeline',
        name: 'Timeline',
        meta: { title: '动态' },
        component: () => import('@/views/Account/Timeline/index.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        meta: { title: '设置' },
        component: () => import('@/views/Account/Settings/index.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录 | 注册' },
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    meta: { title: '404' },
    component: () => import('@/views/Error/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(() => {
  window.loadingBar?.start();
})

router.afterEach((to) => {
  let title = ''
  to.matched.forEach(({ meta }) => {
    if (meta.title) title = meta.title as string;
  })
  if (title) document.title = 'Ivan1105 - ' + title;
  else document.title = 'Ivan1105';
  window.loadingBar?.finish();
})

router.onError(() => {
  window.loadingBar?.error();
})

export default router
