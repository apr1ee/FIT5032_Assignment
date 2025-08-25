import { createRouter, createWebHistory } from 'vue-router'

// 懒加载页面组件
const HomePage = () => import('../pages/HomePage.vue')
const AuthPage = () => import('../pages/AuthPage.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/auth', name: 'auth', component: AuthPage },
  // 之后再逐步加：/journal, /trends, /resources 等
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
