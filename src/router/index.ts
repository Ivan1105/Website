/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes: routes => {
    let rs = setupLayouts(routes);
    rs.forEach(r => {
      if (r.path === '/Admin') r.component = () => import('@/layouts/Admin.vue');
    });
    return rs;
  },
})

export default router
