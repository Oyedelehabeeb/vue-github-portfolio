// import TheError from '@/components/TheError.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/loading',
      name: 'loading',
      component: () => import('../views/LoadingView.vue')
    }
  ]
})

export default router
