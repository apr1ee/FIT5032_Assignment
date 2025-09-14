<!-- src/pages/auth/RegisterPage.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full mx-auto">
      <!-- 注册表单卡片 -->
      <div class="bg-white shadow-xl rounded-2xl p-8">
        <RegisterForm 
          @register-success="handleRegisterSuccess"
          @register-error="handleRegisterError"
        />
      </div>

      <!-- 底部帮助信息 -->
      <div class="mt-8 text-center">
        <div class="text-sm text-gray-600 space-y-2">
          <p>注册即表示你同意我们的</p>
          <div class="space-x-4">
            <a href="/terms" class="text-blue-600 hover:text-blue-700 hover:underline">
              服务条款
            </a>
            <a href="/privacy" class="text-blue-600 hover:text-blue-700 hover:underline">
              隐私政策
            </a>
          </div>
        </div>
        
        <!-- 年龄限制提醒 -->
        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800 font-medium">注册要求</p>
          <p class="text-xs text-blue-700 mt-1">
            你必须年满13岁才能注册。如果你未满18岁，建议在监护人同意下使用本平台。
          </p>
        </div>

        <!-- 安全提醒 -->
        <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-800 font-medium">安全承诺</p>
          <p class="text-xs text-green-700 mt-1">
            我们承诺保护你的隐私，所有数据都经过加密处理，你可以选择匿名分享内容。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegisterForm from '../../components/auth/RegisterForm.vue'

export default {
  name: 'RegisterPage',
  components: {
    RegisterForm
  },
  setup() {
    
    const handleRegisterSuccess = (userData) => {
      console.log('注册成功:', userData)
      // 页面跳转已在RegisterForm组件中处理
    }

    const handleRegisterError = (error) => {
      console.error('注册失败:', error)
      // 错误处理已在RegisterForm组件中处理
    }

    return {
      handleRegisterSuccess,
      handleRegisterError
    }
  }
}
</script>