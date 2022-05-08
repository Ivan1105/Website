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

router.afterEach((to) => {
  const title = to.matched[0].meta.title as string;
  if (title) document.title = 'Ivan1105 - ' + title;
  else document.title = 'Ivan1105';
  window.loadingBar?.finish();
})

router.onError(() => {
  window.loadingBar?.error();
})

export default router
