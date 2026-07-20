import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectView from '../views/ProjectView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectView,
    props: true
  },
  // Catch-all redirect to Home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Lenis handles all scrolling — disable native scroll behavior to avoid conflicts
  scrollBehavior() {
    return false
  }
})

export default router
