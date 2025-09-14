<template>
  <header class="bg-white shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-sm">M</span>
          </div>
          <span class="text-xl font-bold text-gray-900">MindCare</span>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link to="/" class="text-gray-700 hover:text-blue-600 transition-colors">
            首页
          </router-link>
          <router-link to="/learn" class="text-gray-700 hover:text-blue-600 transition-colors">
            学习
          </router-link>
          <router-link to="/journal" class="text-gray-700 hover:text-blue-600 transition-colors">
            日记
          </router-link>
          <router-link to="/resources" class="text-gray-700 hover:text-blue-600 transition-colors">
            资源
          </router-link>
        </div>

        <!-- Action Buttons -->
        <div class="hidden md:flex items-center space-x-4">
          <button class="text-blue-600 hover:text-blue-700 px-4 py-2 font-medium transition-colors">
            登录
          </button>
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            注册
          </button>
        </div>

        <!-- Mobile menu button -->
        <button 
          class="md:hidden p-2"
          @click="toggleMobileMenu"
        >
          <span class="sr-only">打开菜单</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="showMobileMenu" class="md:hidden mt-4 pb-4 border-t border-gray-200">
        <div class="space-y-4 pt-4">
          <router-link to="/" class="block text-gray-700 hover:text-blue-600 transition-colors">
            首页
          </router-link>
          <router-link to="/learn" class="block text-gray-700 hover:text-blue-600 transition-colors">
            学习
          </router-link>
          <router-link to="/journal" class="block text-gray-700 hover:text-blue-600 transition-colors">
            日记
          </router-link>
          <router-link to="/resources" class="block text-gray-700 hover:text-blue-600 transition-colors">
            资源
          </router-link>
          <div class="flex flex-col space-y-2 pt-4 border-t border-gray-200">
            <button class="text-left text-blue-600 hover:text-blue-700 font-medium transition-colors">
              登录
            </button>
            <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              注册
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'AppHeader',
  setup() {
    const showMobileMenu = ref(false)

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    return {
      showMobileMenu,
      toggleMobileMenu
    }
  }
}
</script>