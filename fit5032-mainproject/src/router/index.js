import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../pages/HomePage.vue')
const AuthPage = () => import('../pages/AuthPage.vue')
const JournalCompose = () => import('../pages/JournalCompose.vue')
const JournalList = () => import('../pages/JournalList.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/auth', name: 'auth', component: AuthPage },
  { path: '/journal', name: 'journal-compose', component: JournalCompose },
  { path: '/journals', name: 'journal-list', component: JournalList },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
