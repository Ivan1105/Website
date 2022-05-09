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
        path: 'gamerecord/:id?',
        component: () => import('@/views/Tool.GameRecord.vue')
      },
      {
        path: 'deemo',
        meta: { title: 'Deemo练习记录' },
        component: () => import('@/views/Tools/Deemo/Tool.Deemo.vue')
      }
    ]
  },
  {
    path: '/404',
    name: 'NotFound',
    meta: { title: '404' },
    component: () => import('@/views/Error/404.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
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
