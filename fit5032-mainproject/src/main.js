import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './styles/main.css'

// 导入页面组件
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/auth/LoginPage.vue'
import RegisterPage from './pages/auth/RegisterPage.vue'
import RatingDemoPage from './pages/RatingDemoPage.vue'
import SecureJournalCompose from './pages/journal/SecureJournalCompose.vue'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginPage,
    meta: { 
      requiresGuest: true,
      title: '登录 - MindCare'
    }
  },
  {
    path: '/auth/register',
    name: 'Register', 
    component: RegisterPage,
    meta: { 
      requiresGuest: true,
      title: '注册 - MindCare'
    }
  },
  {
    path: '/demo/rating',
    name: 'RatingDemo',
    component: RatingDemoPage,
    meta: {
      title: '评分系统演示 - MindCare'
    }
  },
  {
    path: '/journal/compose',
    name: 'JournalCompose',
    component: SecureJournalCompose,
    meta: {
      requiresAuth: true,
      title: '写日记 - MindCare'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')