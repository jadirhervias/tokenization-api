import { createRouter, createWebHistory } from 'vue-router'
import CardFormView from '../views/CardFormView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CardFormView
    }
  ]
})

export default router
