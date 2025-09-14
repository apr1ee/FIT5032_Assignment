<!-- src/pages/auth/LoginPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <!-- 成功消息 -->
      <div v-if="successMessage" class="mb-6 rounded-md bg-green-50 p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <div class="ml-3">
            <p class="text-sm text-green-800">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <!-- 登录表单卡片 -->
      <div class="bg-white shadow-xl rounded-2xl p-8">
        <LoginForm 
          @login-success="handleLoginSuccess"
          @login-error="handleLoginError"
        />
      </div>

      <!-- 底部帮助信息 -->
      <div class="mt-8 text-center">
        <div class="text-sm text-gray-600 space-y-2">
          <p>需要帮助？</p>
          <div class="space-x-4">
            <a href="/support" class="text-blue-600 hover:text-blue-700 hover:underline">
              联系支持
            </a>
            <a href="/about" class="text-blue-600 hover:text-blue-700 hover:underline">
              关于平台
            </a>
            <a href="/privacy" class="text-blue-600 hover:text-blue-700 hover:underline">
              隐私政策
            </a>
          </div>
        </div>
        
        <!-- 危机支持信息 -->
        <div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800 font-medium">紧急情况？</p>
          <p class="text-xs text-red-700 mt-1">
            如果你正在经历危机，请立即寻求帮助：Lifeline 13 11 14
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LoginForm from '../../components/auth/LoginForm.vue'

export default {
  name: 'LoginPage',
  components: {
    LoginForm
  },
  setup() {
    const route = useRoute()
    const successMessage = ref('')

    // 检查URL参数中的成功消息
    onMounted(() => {
      const message = route.query.message
      if (message === 'register-success') {
        successMessage.value = '注册成功！请登录你的账户。'
      } else if (message === 'logout-success') {
        successMessage.value = '你已安全退出登录。'
      } else if (message === 'password-reset-success') {
        successMessage.value = '密码重置成功！请使用新密码登录。'
      }

      // 3秒后自动清除消息
      if (successMessage.value) {
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      }
    })

    const handleLoginSuccess = (userData) => {
      console.log('登录成功:', userData)
      // 这里可以添加用户数据到全局状态管理
      // 页面跳转已在LoginForm组件中处理
    }

    const handleLoginError = (error) => {
      console.error('登录失败:', error)
      // 错误处理已在LoginForm组件中处理
    }

    return {
      successMessage,
      handleLoginSuccess,
      handleLoginError
    }
  }
}
</script>