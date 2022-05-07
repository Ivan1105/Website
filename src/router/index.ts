import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tool',
    name: 'Tool',
    component: () => import('@/views/Tool.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Tool.Home.vue')
      },
      {
        path: 'gamerecord/:id?',
        component: () => import('@/views/Tool.GameRecord.vue')
      },
      {
        path: 'deemo',
        component: () => import('@/views/Tool.Deemo.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(() => {
  window.loadingBar?.start();
})

router.afterEach(() => {
  window.loadingBar?.finish();
})

router.onError(() => {
  window.loadingBar?.error();
})

export default router
