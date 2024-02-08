import { createRouter, createWebHistory } from 'vue-router'
import ExecuteView from '../views/ExecuteView.vue'
import MonitorView from '../views/MonitorView.vue'
import PlanView from '../views/PlanView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/plan'
    },
    {
      path: '/plan',
      name: 'plan',
      component: PlanView
    },
    {
      path: '/execute',
      name: 'execute',
      component: ExecuteView
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: MonitorView
    }
  ]
})

export default router
