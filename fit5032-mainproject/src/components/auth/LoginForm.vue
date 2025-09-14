<!-- src/components/auth/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">欢迎回来</h2>
      <p class="mt-2 text-gray-600">登录到你的心理健康伙伴</p>
    </div>

    <!-- 邮箱输入 -->
    <FormInput
      ref="emailRef"
      v-model="formData.email"
      type="email"
      label="邮箱地址"
      placeholder="请输入你的邮箱"
      required
      :validation-rules="['required', 'email']"
      :disabled="isLoading"
      @blur="validateEmail"
    />

    <!-- 密码输入 -->
    <FormInput
      ref="passwordRef"
      v-model="formData.password"
      type="password"
      label="密码"
      placeholder="请输入密码"
      required
      :validation-rules="['required', 'min:6']"
      :disabled="isLoading"
      @blur="validatePassword"
    />

    <!-- 记住我 -->
    <div class="flex items-center justify-between">
      <FormCheckbox
        v-model="formData.rememberMe"
        label="记住我"
        description="7天内保持登录状态"
        :disabled="isLoading"
      />
      
      <router-link 
        to="/auth/forgot-password" 
        class="text-sm text-blue-600 hover:text-blue-700 hover:underline"
      >
        忘记密码？
      </router-link>
    </div>

    <!-- 错误提示 -->
    <div v-if="submitError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">登录失败</h3>
          <p class="text-sm text-red-700 mt-1">{{ submitError }}</p>
        </div>
      </div>
    </div>

    <!-- 提交按钮 -->
    <button
      type="submit"
      :disabled="isLoading || !isFormValid"
      class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg transition-colors"
    >
      <span v-if="!isLoading">登录</span>
      <div v-else class="flex items-center">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        登录中...
      </div>
    </button>

    <!-- 外部认证分割线 -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-white text-gray-500">或者使用</span>
      </div>
    </div>

    <!-- 外部认证按钮 -->
    <ExternalAuthButtons 
      @google-login="handleGoogleLogin"
      @apple-login="handleAppleLogin"
      :disabled="isLoading"
    />

    <!-- 注册链接 -->
    <div class="text-center">
      <span class="text-gray-600">还没有账户？</span>
      <router-link 
        to="/auth/register" 
        class="ml-1 text-blue-600 hover:text-blue-700 hover:underline font-medium"
      >
        立即注册
      </router-link>
    </div>
  </form>
</template>

<script>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '../forms/FormInput.vue'
import FormCheckbox from '../forms/FormCheckbox.vue'
import ExternalAuthButtons from './ExternalAuthButtons.vue'

export default {
  name: 'LoginForm',
  components: {
    FormInput,
    FormCheckbox,
    ExternalAuthButtons
  },
  emits: ['login-success', 'login-error'],
  setup(props, { emit }) {
    const router = useRouter()
    
    // 表单数据
    const formData = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    // 状态管理
    const isLoading = ref(false)
    const submitError = ref('')
    const emailRef = ref(null)
    const passwordRef = ref(null)

    // 表单验证状态
    const isFormValid = computed(() => {
      return formData.email && 
             formData.password && 
             formData.email.includes('@') && 
             formData.password.length >= 6
    })

    // 单个字段验证
    const validateEmail = () => {
      if (emailRef.value) {
        return emailRef.value.validate()
      }
      return false
    }

    const validatePassword = () => {
      if (passwordRef.value) {
        return passwordRef.value.validate()
      }
      return false
    }

    // 验证整个表单
    const validateForm = () => {
      const emailValid = validateEmail()
      const passwordValid = validatePassword()
      return emailValid && passwordValid
    }

    // 处理表单提交
    const handleSubmit = async () => {
      submitError.value = ''
      
      // 验证表单
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        // 这里将来会集成Firebase Auth
        // 现在模拟登录过程
        await simulateLogin(formData)
        
        // 登录成功
        emit('login-success', {
          email: formData.email,
          rememberMe: formData.rememberMe
        })
        
        // 跳转到仪表板
        router.push('/dashboard')
        
      } catch (error) {
        submitError.value = error.message || '登录失败，请稍后重试'
        emit('login-error', error)
      } finally {
        isLoading.value = false
      }
    }

    // 模拟登录函数
    const simulateLogin = async (credentials) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟验证
          if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
            resolve({ success: true })
          } else {
            reject(new Error('邮箱或密码不正确'))
          }
        }, 1500)
      })
    }

    // Google登录
    const handleGoogleLogin = async () => {
      isLoading.value = true
      try {
        // Firebase Google Auth 将在这里实现
        console.log('Google登录')
        emit('login-success', { provider: 'google' })
      } catch (error) {
        submitError.value = 'Google登录失败'
        emit('login-error', error)
      } finally {
        isLoading.value = false
      }
    }

    // Apple登录
    const handleAppleLogin = async () => {
      isLoading.value = true
      try {
        // Firebase Apple Auth 将在这里实现
        console.log('Apple登录')
        emit('login-success', { provider: 'apple' })
      } catch (error) {
        submitError.value = 'Apple登录失败'
        emit('login-error', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      formData,
      isLoading,
      submitError,
      emailRef,
      passwordRef,
      isFormValid,
      validateEmail,
      validatePassword,
      handleSubmit,
      handleGoogleLogin,
      handleAppleLogin
    }
  }
}
</script>