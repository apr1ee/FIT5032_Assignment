import { createRouter, createWebHistory } from 'vue-router'
import { requireRole } from '../utils/authStore'

const HomePage        = () => import('../pages/HomePage.vue')
const AuthPage        = () => import('../pages/AuthPage.vue')
const JournalCompose  = () => import('../pages/JournalCompose.vue')
const JournalList     = () => import('../pages/JournalList.vue')
const AdminPage       = () => import('../pages/AdminPage.vue')

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/auth', name: 'auth', component: AuthPage },
  { path: '/journal', name: 'journal', component: JournalCompose, meta: { roles: ['user','admin'] }},
  { path: '/journals', name: 'journals', component: JournalList,  meta: { roles: ['user','admin'] }},
  { path: '/admin', name: 'admin', component: AdminPage,          meta: { roles: ['admin'] }},
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior:()=>({top:0}) })

router.beforeEach((to) => {
  if (!to.meta?.roles) return true
  const check = requireRole(to.meta.roles)
  if (check.ok) return true
  if (check.reason === 'unauthenticated') return { name:'auth', query:{ r: to.fullPath } }
  return { name:'home' }
})

export default router
